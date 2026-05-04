import { Dependency } from '@semantic-ui/reactivity';
import { assignInPlace, createCache, filterObject, inArray } from '@semantic-ui/utils';

import {
  ATTR_MARKER_PREFIX,
  BLOCK_CLOSE_PREFIX,
  BLOCK_MARKER,
  buildHTMLString as buildHTMLStringPure,
  COMMENT_MARKER,
  DATA_SUI_BIND,
  parseAttributeParts as parseAttributePartsFn,
  parseServerMeta,
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

// AST → { html, svg } cache, where each slot holds the buildHTMLString
// result for that namespace. Keyed on the AST array (immutable after
// compile), so entries never stale and GC follows naturally.
const buildStringCache = new WeakMap();

function cachedBuildHTMLString(ast, options) {
  let entry = buildStringCache.get(ast);
  if (!entry) {
    entry = { html: null, svg: null };
    buildStringCache.set(ast, entry);
  }
  const slot = options.isSVG ? 'svg' : 'html';
  if (entry[slot] === null) {
    entry[slot] = buildHTMLStringPure(ast, options);
  }
  return entry[slot];
}

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
    this.receivesData = receivesData;
    this.protectedKeys = protectedKeys;
    // Sequential debug ID. Subtree caching would key on hashCode(ast+data)
    // but isn't implemented in the native engine.
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
    return cachedBuildHTMLString(ast, { snippets: this.snippets, isSVG });
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

  // Attribute binding — delegates to reactive-data.js. See that module for
  // the dispatch on entry.classification.type (property / event / boolean
  // / ifDefined / interpolated / single-expression). `skipFirstWrite` is
  // passed through by hydrateAttributes.
  bindAttributeExpression(
    element,
    attrName,
    parts,
    firstMarkerID,
    entries,
    data,
    scope,
    { skipFirstWrite = false } = {},
  ) {
    bindAttribute({ element, attrName, parts, firstMarkerID, entries, data, scope, renderer: this, skipFirstWrite });
  }

  bindMarkers(root, entries, data, scope, ast) {
    if (entries.length === 0) { return; }

    // Single-pass walker over SHOW_ELEMENT | SHOW_COMMENT. Attribute
    // processing is safe inline (only touches the element's own
    // attributes); comment processing is deferred because it mutates the
    // tree structure (replace/remove) and would invalidate the live walker.
    const processedAttrIDs = new Set();
    const commentsToProcess = [];
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
    );
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        const attrsToProcess = [];
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          if (attr.value.includes(ATTR_MARKER_PREFIX)) {
            attrsToProcess.push({ name: attr.name, value: attr.value });
          }
        }
        for (const { name: attrName, value: attrValue } of attrsToProcess) {
          const { parts, markerIDs } = parseAttributePartsFn(attrValue);
          for (const id of markerIDs) { processedAttrIDs.add(id); }
          this.bindAttributeExpression(element, attrName, parts, markerIDs[0], entries, data, scope);
        }
      }
      else {
        const text = node.data;
        if (text.startsWith(COMMENT_MARKER)) {
          const markerID = parseInt(text.slice(COMMENT_MARKER.length));
          if (!isNaN(markerID)) {
            // Filter deferred until after the walk: elements visit before
            // sibling comments in document order, so an attr-marker's
            // owning element is always recorded before any comment that
            // would share its ID.
            commentsToProcess.push({ comment: node, markerID, type: 'expression' });
          }
        }
        else if (text.startsWith(RAW_TEXT_MARKER)) {
          const markerID = parseInt(text.slice(RAW_TEXT_MARKER.length));
          if (!isNaN(markerID)) {
            commentsToProcess.push({ comment: node, markerID, type: 'rawText' });
          }
        }
        else if (text.startsWith(BLOCK_MARKER)) {
          const markerID = parseInt(text.slice(BLOCK_MARKER.length));
          if (!isNaN(markerID)) {
            commentsToProcess.push({ comment: node, markerID, type: 'block' });
          }
        }
      }
    }

    for (const { comment, markerID, type } of commentsToProcess) {
      if (type === 'expression' && processedAttrIDs.has(markerID)) { continue; }
      const entry = entries[markerID];

      if (type === 'expression') {
        this.bindTextExpression(comment, entry, data, scope);
      }
      else if (type === 'rawText') {
        this.bindRawTextContent(comment, entry, data, scope);
      }
      else if (type === 'block') {
        this.bindBlock(comment, entry, data, scope);
      }
    }
  }

  /*******************************
      Raw Text Element Bindings
  *******************************/

  bindRawTextContent(comment, entry, data, scope) {
    bindRawTextContentFn({ comment, entry, data, scope, renderer: this });
  }

  // Raw-text walker — used for <script>, <style>, <textarea>, <title>
  // content where DOM nodes can't exist. Dispatches html/expression nodes
  // directly and delegates block-shaped children to their block's
  // evaluateText static. Blocks without an evaluateText impl throw —
  // raw-text contexts can't host blocks whose semantics need a live DOM
  // region or asynchronous lifecycle.
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
      if (!block?.evaluateText) {
        throw new Error(
          `{#${node.type}} cannot be rendered inside raw-text contexts `
            + `(<script>, <style>, <textarea>, <title>).`,
        );
      }
      result += block.evaluateText({ node, data, renderer: this });
    }
    return result;
  }

  /*******************************
        Text Bindings
  *******************************/

  bindTextExpression(comment, entry, data, scope) {
    bindTextExpressionFn({ comment, entry, data, scope, renderer: this });
  }

  /*******************************
        Block Directive Binding
  *******************************/

  bindBlock(comment, entry, data, scope) {
    const { node, isSVG } = entry;
    const block = getBlock(node.type);
    if (!block) { return; }
    const region = new DynamicRegion(comment.parentNode, comment);
    block({ node, data, scope, region, renderer: this, isSVG, hydrating: false });
  }

  /*******************************
        Hydration
  *******************************/

  hydrateMarkers({ root, entries, data, scope }) {
    if (entries.length === 0) { return; }

    // Pass 1: walk elements with data-sui-bind, wire attribute Reactions.
    // hydrateAttributes is a no-op when no element carries the marker, so
    // no pre-walk gate is needed.
    this.hydrateAttributes(root, entries, data, scope);

    // Pass 2: Walk comments for text and block markers — top level only.
    // Inner markers (inside block pairs) are handled recursively by block handlers.
    const commentWalker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    const commentsToProcess = [];
    let comment;
    let blockDepth = 0;
    while ((comment = commentWalker.nextNode())) {
      const text = comment.data;

      // Track block nesting — skip inner markers
      if (text.startsWith(BLOCK_CLOSE_PREFIX)) {
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
        this.hydrateBlock(comment, entry, data, scope);
      }
    }
  }

  // Walk SHOW_ELEMENT | SHOW_COMMENT once, process `data-sui-bind` on
  // elements at block-depth 0, and let block hydrate hooks recurse into
  // their own contents via hydrateInnerContent. Depth is tracked inline
  // from the block markers we encounter. The data-sui-bind attribute
  // itself is stripped by the post-hydration cleanup pass (base.js
  // removeMarkers).
  hydrateAttributes(root, entries, data, scope) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
    );
    let node;
    let blockDepth = 0;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.COMMENT_NODE) {
        const text = node.data;
        if (text.startsWith(BLOCK_MARKER)) {
          blockDepth++;
        }
        else if (text.startsWith(BLOCK_CLOSE_PREFIX)) {
          blockDepth--;
        }
        continue;
      }
      if (blockDepth > 0) { continue; }
      const bindStr = node.getAttribute(DATA_SUI_BIND);
      if (!bindStr) { continue; }
      for (const binding of bindStr.split(',')) {
        const eqIdx = binding.lastIndexOf('=');
        if (eqIdx === -1) { continue; }
        const rawAttrName = binding.slice(0, eqIdx);
        const entryId = parseInt(binding.slice(eqIdx + 1));
        if (isNaN(entryId)) { continue; }
        const entry = entries[entryId];
        if (!entry || !entry.attributeBinding) { continue; }
        const { parts, firstMarkerID } = entry.attributeBinding;
        // Strip `.` / `@` prefix for the DOM attribute name. bindAttribute
        // uses `classification.type` / `classification.attribute` for the
        // real dispatch; the name passed here is only used for the
        // `setAttribute` / `removeAttribute` path of regular-attribute
        // bindings (booleans, interpolated, single-expression strings).
        const domAttrName = (rawAttrName.charAt(0) === '.' || rawAttrName.charAt(0) === '@')
          ? rawAttrName.slice(1)
          : rawAttrName;
        this.bindAttributeExpression(node, domAttrName, parts, firstMarkerID, entries, data, scope, {
          skipFirstWrite: true,
        });
      }
    }
  }

  // Hydrating text-expression binding — delegates to reactive-data.js.
  hydrateTextExpression(comment, entry, data, scope) {
    hydrateTextExpressionFn({ comment, entry, data, scope, renderer: this });
  }

  hydrateBlock(comment, entry, data, scope) {
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
        else if (next.data.startsWith(BLOCK_CLOSE_PREFIX)) {
          blockDepth--;
          if (blockDepth === 0) {
            parseServerMeta(next.data, serverMeta);
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

  hydrateInnerContent({ ownedNodes, innerAST, data, scope }) {
    const { entries } = cachedBuildHTMLString(innerAST, { snippets: this.snippets });
    if (entries.length === 0) { return; }

    // Wrap ownedNodes in a temporary container for TreeWalker traversal
    const container = document.createDocumentFragment();
    for (const n of [...ownedNodes]) {
      container.appendChild(n);
    }

    // Recursively hydrate inner markers with the sub-AST's entries.
    this.hydrateMarkers({ root: container, entries, data, scope });

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
