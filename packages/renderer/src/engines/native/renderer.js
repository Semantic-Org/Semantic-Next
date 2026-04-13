import { Dependency } from '@semantic-ui/reactivity';
import { assignInPlace, createCache, filterObject, inArray } from '@semantic-ui/utils';

import {
  ATTR_MARKER_PREFIX,
  ATTR_MARKER_SUFFIX,
  BLOCK_MARKER,
  buildHTMLString as buildHTMLStringPure,
  COMMENT_MARKER,
  RAW_TEXT_MARKER,
} from '../../build-html-string.js';
import { ExpressionEvaluator } from '../../expression-evaluator.js';
import { getBlock } from './blocks/registry.js';
import { DynamicRegion } from './dynamic-region.js';
import { ReactionScope } from './reaction-scope.js';
import {
  bindAttribute,
  bindRawTextContent as bindRawTextContentFn,
  bindTextExpression as bindTextExpressionFn,
  hydrateTextExpression as hydrateTextExpressionFn,
} from './reactive-data.js';
// Side-effect import: every block module self-registers into the block registry.
import './blocks/index.js';

// PreparedTemplate cache — parse once, cloneNode per instance
const templateCache = createCache({ maxSize: 1000, eviction: 'flush' });

// Regex for finding attribute markers — compiled once since prefix/suffix are constants
const ATTR_MARKER_REGEX = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');

export class Renderer {
  static nextId = 0;
  constructor(
    {
      ast,
      data,
      template,
      subTemplates,
      snippets,
      helpers,
      isSVG = false,
      inheritsData = true,
      receivesData = false,
      protectedKeys,
    } = {},
  ) {
    this.ast = ast || [];
    this.data = data;
    this.template = template;
    this.subTemplates = subTemplates;
    this.snippets = snippets || {};
    this.collectSnippets(this.ast);
    this.helpers = helpers || {};
    this.isSVG = isSVG;
    this.inheritsData = inheritsData;
    this.receivesData = receivesData;
    this.protectedKeys = protectedKeys;
    // Lit uses hashCode({ ast, data, isSVG }) for subtree caching here.
    // Native renderer doesn't cache subtrees yet, and fnv1a over the full
    // AST + data context costs ~1.4ms per construction — visible in hydration
    // flamecharts. Use a cheap sequential ID for debugging until subtree
    // caching is implemented.
    this.id = ++Renderer.nextId;
    this.dataDep = new Dependency();
    this.scope = new ReactionScope();

    this.evaluator = new ExpressionEvaluator({
      data: this.data,
      helpers: this.helpers,
      dataVersion: this.dataDep,
    });

    // DOM change notification — coalesced so multiple async resolutions
    // or data bumps in the same tick fire onUpdated only once
    this.updateScheduled = false;
    this.notifyUpdate = () => {
      if (this.updateScheduled) { return; }
      this.updateScheduled = true;
      queueMicrotask(() => {
        this.updateScheduled = false;
        this.template?.onUpdated?.();
      });
    };
  }

  // Register snippet definitions from the AST. The compiler hoists
  // snippets to the front, so a top-level scan is sufficient.
  collectSnippets(ast) {
    for (const node of ast) {
      if (node.type === 'snippet') {
        this.snippets[node.name] = node;
      }
    }
  }

  // Look up an expression value — only track dataDep for renderers that receive
  // data from a parent (subtemplates). Top-level component renderers use
  // fine-grained Signal tracking and don't need coarse invalidation.
  // Named to mirror ExpressionEvaluator.lookupExpressionValue; 2-arg positional
  // because it's in hot reactive loops (per-expression, potentially 100× per render).
  lookupExpression(expression, data) {
    if (this.receivesData) {
      this.dataDep.depend();
    }
    return this.evaluator.lookupExpressionValue(expression, data);
  }

  render() {
    return this.readAST({
      ast: this.ast,
      data: this.data,
      scope: this.scope,
    });
  }

  /*******************************
        AST → DOM
  *******************************/
  /*

  The key insight: the entire AST (HTML + expressions + block directives)
  is assembled into a single HTML string with markers for ALL dynamic
  positions. This string is parsed ONCE via template.innerHTML, producing
  a correct DOM tree where block markers are positioned inside their
  containing elements. Then a TreeWalker pass wires reactive bindings
  and replaces block markers with live DynamicRegions.

  */

  readAST({ ast, data, scope, isSVG = this.isSVG }) {
    // Phase 1: Build a single HTML string with markers for everything
    const { htmlString, entries } = this.buildHTMLString(ast, isSVG);

    if (!htmlString && entries.length === 0) {
      return document.createDocumentFragment();
    }

    // Phase 2: Parse the HTML string into a DOM tree
    const fragment = this.parseHTML(htmlString, isSVG);

    // Phase 3: Walk the DOM tree, find markers, wire bindings
    this.bindMarkers(fragment, entries, data, scope, ast);

    return fragment;
  }

  /*******************************
      Phase 1: HTML String Assembly
  *******************************/

  buildHTMLString(ast, isSVG) {
    return buildHTMLStringPure(ast, { snippets: this.snippets, isSVG });
  }

  /*******************************
      Phase 2: HTML Parsing
  *******************************/

  parseHTML(htmlString, isSVG = false) {
    const cacheKey = isSVG ? `svg:${htmlString}` : htmlString;
    let cached = templateCache.get(cacheKey);

    if (!cached) {
      if (isSVG) {
        const wrapper = document.createElement('template');
        wrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${htmlString}</svg>`;
        cached = document.createElement('template');
        const svgEl = wrapper.content.firstChild;
        while (svgEl.firstChild) { cached.content.append(svgEl.firstChild); }
      }
      else {
        cached = document.createElement('template');
        cached.innerHTML = htmlString;
      }
      templateCache.set(cacheKey, cached);
    }

    return cached.content.cloneNode(true);
  }

  /*******************************
      Phase 3: Marker Binding
  *******************************/

  // Parse an attribute value containing marker tokens into static/dynamic parts.
  parseAttributeParts(attrValue) {
    const parts = [];
    const markerIDs = [];
    let lastIndex = 0;
    let match;
    ATTR_MARKER_REGEX.lastIndex = 0;
    while ((match = ATTR_MARKER_REGEX.exec(attrValue)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ static: attrValue.slice(lastIndex, match.index) });
      }
      const markerID = parseInt(match[1]);
      parts.push({ markerID });
      markerIDs.push(markerID);
      lastIndex = ATTR_MARKER_REGEX.lastIndex;
    }
    if (lastIndex < attrValue.length) {
      parts.push({ static: attrValue.slice(lastIndex) });
    }
    return { parts, markerIDs };
  }

  // Attribute binding — delegates to reactive-data.js. See that module for
  // the dispatch on entry.classification.type (property / event / boolean
  // / ifDefined / interpolated / single-expression). `skipFirstWrite` is
  // passed through by hydrateAttributes.
  bindAttributeExpression(element, attrName, parts, entries, data, scope, { skipFirstWrite = false } = {}) {
    bindAttribute({ element, attrName, parts, entries, data, scope, renderer: this, skipFirstWrite });
  }

  bindMarkers(root, entries, data, scope, ast) {
    if (entries.length === 0) { return; }

    // Pass 1: Bind attribute markers on elements
    const processedAttrIDs = new Set();
    const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let el;
    while ((el = elementWalker.nextNode())) {
      const element = el;
      const attrsToProcess = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.value.includes(ATTR_MARKER_PREFIX)) {
          attrsToProcess.push({ name: attr.name, value: attr.value });
        }
      }

      for (const { name: attrName, value: attrValue } of attrsToProcess) {
        const { parts, markerIDs } = this.parseAttributeParts(attrValue);
        for (const id of markerIDs) { processedAttrIDs.add(id); }
        this.bindAttributeExpression(element, attrName, parts, entries, data, scope);
      }
    }

    // Pass 2: Walk comment nodes for text, block, and raw text markers
    const commentWalker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    const commentsToProcess = [];
    let comment;
    while ((comment = commentWalker.nextNode())) {
      const text = comment.data;
      if (text.startsWith(COMMENT_MARKER)) {
        const markerID = parseInt(text.slice(COMMENT_MARKER.length));
        if (!isNaN(markerID) && !processedAttrIDs.has(markerID)) {
          commentsToProcess.push({ comment, markerID, type: 'expression' });
        }
      }
      else if (text.startsWith(RAW_TEXT_MARKER)) {
        const markerID = parseInt(text.slice(RAW_TEXT_MARKER.length));
        if (!isNaN(markerID)) {
          commentsToProcess.push({ comment, markerID, type: 'rawText' });
        }
      }
      else if (text.startsWith(BLOCK_MARKER)) {
        const markerID = parseInt(text.slice(BLOCK_MARKER.length));
        if (!isNaN(markerID)) {
          commentsToProcess.push({ comment, markerID, type: 'block' });
        }
      }
    }

    for (const { comment, markerID, type } of commentsToProcess) {
      const entry = entries[markerID];

      if (type === 'expression') {
        this.bindTextExpression(comment, entry, data, scope);
      }
      else if (type === 'rawText') {
        this.bindRawTextContent(comment, entry, data, scope);
      }
      else if (type === 'block') {
        this.bindBlockDirective(comment, entry, data, scope);
      }
    }
  }

  /*******************************
      Raw Text Element Bindings
  *******************************/

  // Raw-text element binding — delegates to reactive-data.js.
  bindRawTextContent(comment, entry, data, scope) {
    bindRawTextContentFn({ comment, entry, data, scope, renderer: this });
  }

  // Evaluate AST nodes into a plain text string — used for content inside
  // raw text elements where DOM nodes can't exist. Mirrors the ServerRenderer's
  // evaluation logic but uses the reactive expression evaluator so Signal
  // dependencies are tracked inside Reactions.
  // Raw-text walker — dispatches html/expression nodes directly and
  // delegates block-shaped children (if/each/template) to their block's
  // evaluateText static. Blocks not legal in raw-text contexts (async,
  // rerender, snippet) silently no-op via the registry lookup returning
  // a block without the static.
  evaluateRawTextNodes(nodes, data) {
    let result = '';
    for (const node of nodes) {
      if (node.type === 'html') {
        result += node.html;
        continue;
      }
      if (node.type === 'expression') {
        result += String(this.lookupExpression(node.value, data) ?? '');
        continue;
      }
      const block = getBlock(node.type);
      if (block?.evaluateText) {
        result += block.evaluateText({ node, data, renderer: this });
      }
    }
    return result;
  }

  /*******************************
        Text Bindings
  *******************************/

  // Text-expression binding — delegates to reactive-data.js.
  bindTextExpression(comment, entry, data, scope) {
    bindTextExpressionFn({ comment, entry, data, scope, renderer: this });
  }

  /*******************************
        Block Directive Binding
  *******************************/

  bindBlockDirective(comment, entry, data, scope) {
    const { node, isSVG } = entry;
    this.bindBlockViaRegistry({ node, data, scope, comment, isSVG });
  }

  // Dispatches to a registered block via the registry. Used for block types
  // that have been extracted to packages/renderer/src/engines/native/blocks/.
  // As each type migrates from the inline createX/hydrateX pattern, its
  // bindBlockDirective case routes here.
  bindBlockViaRegistry({ node, data, scope, comment, isSVG }) {
    const block = getBlock(node.type);
    if (!block) { return; }
    const region = new DynamicRegion(comment.parentNode, comment);
    block({ node, data, scope, region, renderer: this, isSVG, hydrating: false });
  }

  hydrateBlockViaRegistry({ node, entry, data, scope, region, serverMeta }) {
    const block = getBlock(node.type);
    if (!block) { return; }
    block({ node, data, scope, region, renderer: this, isSVG: entry.isSVG, serverMeta, hydrating: true });
  }

  /*******************************
        Hydration
  *******************************/

  hydrateMarkers(root, entries, data, scope, { ast } = {}) {
    if (entries.length === 0) { return; }

    // Classify entries
    const attrEntries = [];
    for (const entry of entries) {
      if (entry.type === 'expression' && entry.classification?.insideTag) {
        attrEntries.push(entry);
      }
    }

    // Pass 1: Hydrate attribute bindings via reference DOM matching
    if (attrEntries.length > 0) {
      this.hydrateAttributes(root, entries, data, scope, ast);
    }

    // Pass 2: Walk comments for text and block markers — top level only.
    // Inner markers (inside block pairs) are handled recursively by block handlers.
    const commentWalker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    const commentsToProcess = [];
    let comment;
    let blockDepth = 0;
    while ((comment = commentWalker.nextNode())) {
      const text = comment.data;

      // Track block nesting — skip inner markers
      if (text.startsWith('/sui-block:')) {
        blockDepth--;
        continue;
      }
      if (blockDepth > 0) {
        // Track nested opening markers so closing markers stay balanced
        if (text.startsWith(BLOCK_MARKER)) {
          blockDepth++;
        }
        continue;
      }

      if (text.startsWith(COMMENT_MARKER)) {
        const markerID = parseInt(text.slice(COMMENT_MARKER.length));
        if (!isNaN(markerID)) {
          commentsToProcess.push({ comment, markerID, type: 'expression' });
        }
      }
      else if (text.startsWith(BLOCK_MARKER)) {
        const markerID = parseInt(text.slice(BLOCK_MARKER.length));
        if (!isNaN(markerID)) {
          commentsToProcess.push({ comment, markerID, type: 'block' });
          blockDepth++;
        }
      }
    }

    for (const { comment, markerID, type } of commentsToProcess) {
      const entry = entries[markerID];
      if (!entry) { continue; }

      if (type === 'expression') {
        this.hydrateTextExpression(comment, entry, data, scope);
      }
      else if (type === 'block') {
        this.hydrateBlockDirective(comment, entry, data, scope);
      }
    }
  }

  hydrateAttributes(root, entries, data, scope, ast) {
    // Build a reference DOM from the marker htmlString to find attribute positions.
    // Use the provided AST (from inner content hydration) or fall back to the top-level AST.
    const { htmlString } = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets });
    const refTemplate = document.createElement('template');
    refTemplate.innerHTML = htmlString;
    const refRoot = refTemplate.content;

    // Build a set of real DOM elements owned by block regions so we can skip
    // them during the parallel walk. Block directives (each, if, etc.) are
    // single comments in the reference DOM but expand to N elements in the
    // real DOM — skipping them keeps the walkers aligned.
    const blockOwnedElements = new Set();
    const blockWalker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    let blockComment;
    while ((blockComment = blockWalker.nextNode())) {
      if (!blockComment.data.startsWith(BLOCK_MARKER)) { continue; }
      let next = blockComment.nextSibling;
      let depth = 1;
      while (next && depth > 0) {
        if (next.nodeType === Node.COMMENT_NODE) {
          if (next.data.startsWith(BLOCK_MARKER)) { depth++; }
          else if (next.data.startsWith('/sui-block:')) { depth--; }
        }
        if (depth > 0 && next.nodeType === Node.ELEMENT_NODE) {
          // Mark this element and all its descendants
          const innerWalker = document.createTreeWalker(next, NodeFilter.SHOW_ELEMENT);
          blockOwnedElements.add(next);
          let inner;
          while ((inner = innerWalker.nextNode())) { blockOwnedElements.add(inner); }
        }
        next = next.nextSibling;
      }
    }

    // Walk both trees in parallel (element-only), skipping block-owned real elements
    const refWalker = document.createTreeWalker(refRoot, NodeFilter.SHOW_ELEMENT);
    const realWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) =>
        blockOwnedElements.has(node)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });

    let refEl, realEl;
    while ((refEl = refWalker.nextNode()) && (realEl = realWalker.nextNode())) {
      const element = realEl;
      const attrsToProcess = [];
      for (let i = 0; i < refEl.attributes.length; i++) {
        const attr = refEl.attributes[i];
        if (attr.value.includes(ATTR_MARKER_PREFIX)) {
          attrsToProcess.push({ name: attr.name, value: attr.value });
        }
      }

      for (const { name: attrName, value: attrValue } of attrsToProcess) {
        const { parts } = this.parseAttributeParts(attrValue);
        this.bindAttributeExpression(element, attrName, parts, entries, data, scope, { skipFirstWrite: true });
      }
    }
  }

  // Hydrating text-expression binding — delegates to reactive-data.js.
  hydrateTextExpression(comment, entry, data, scope) {
    hydrateTextExpressionFn({ comment, entry, data, scope, renderer: this });
  }

  hydrateBlockDirective(comment, entry, data, scope) {
    const { node } = entry;
    const parentNode = comment.parentNode;
    const markerID = entry.id;

    // Collect all nodes between opening and closing block markers.
    // Track depth because inner blocks (from nested snippets/conditionals)
    // can share marker IDs when scopes reset — match by nesting depth, not ID.
    const ownedNodes = [];
    let next = comment.nextSibling;
    let serverMeta = {};
    let blockDepth = 1;
    while (next) {
      if (next.nodeType === Node.COMMENT_NODE) {
        if (next.data.startsWith(BLOCK_MARKER)) {
          blockDepth++;
        }
        else if (next.data.startsWith('/sui-block:')) {
          blockDepth--;
          if (blockDepth === 0) {
            // Parse metadata from closing marker (e.g. <!--/sui-block:v1:3:b1000-->)
            for (const part of next.data.split(':')) {
              if (part.startsWith('b')) {
                serverMeta.branchIndex = parseInt(part.slice(1));
              }
            }
            next.remove();
            break;
          }
        }
      }
      ownedNodes.push(next);
      next = next.nextSibling;
    }

    // Create DynamicRegion with server-rendered content. Each registered
    // block's hydrate hook owns its subtree walk — including snippets,
    // which the template block dispatches via its own snippet branch.
    const region = new DynamicRegion(parentNode, comment);
    region.ownedNodes = ownedNodes;
    const block = getBlock(node.type);
    if (block) {
      block({ node, data, scope, region, renderer: this, isSVG: entry.isSVG, serverMeta, hydrating: true });
    }
  }

  hydrateInnerContent(ownedNodes, contentAST, data, scope) {
    const { entries } = buildHTMLStringPure(contentAST, { snippets: this.snippets });
    if (entries.length === 0) { return; }

    // Wrap ownedNodes in a temporary container for TreeWalker traversal
    const container = document.createDocumentFragment();
    for (const n of [...ownedNodes]) {
      container.appendChild(n);
    }

    // Recursively hydrate inner markers with the sub-AST's entries.
    // Pass contentAST so attribute hydration builds the reference DOM
    // from the correct AST (not the top-level component AST).
    this.hydrateMarkers(container, entries, data, scope, { ast: contentAST });

    // Update ownedNodes with the hydrated content (comments may have been removed)
    ownedNodes.length = 0;
    for (const n of [...container.childNodes]) {
      ownedNodes.push(n);
    }
  }

  /*******************************
        Data Management
  *******************************/

  setData(newData) {
    this.updateData(newData, { preserveExistingData: false });
    this.evaluator.setData(this.data);
  }

  updateData(newData, { preserveExistingData = true, respectProtectedKeys = false } = {}) {
    if (respectProtectedKeys && this.protectedKeys) {
      newData = filterObject(newData, (value, key) => !inArray(key, this.protectedKeys));
    }
    assignInPlace(this.data, newData, { preserveExistingKeys: preserveExistingData });
  }

  bumpDataVersion() {
    this.dataDep.changed();
    this.notifyUpdate();
  }
}
