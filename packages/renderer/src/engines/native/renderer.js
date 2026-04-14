import { Dependency } from '@semantic-ui/reactivity';
import { assignInPlace, createCache, filterObject, inArray } from '@semantic-ui/utils';

import {
  ATTR_MARKER_PREFIX,
  ATTR_MARKER_SUFFIX,
  BLOCK_MARKER,
  buildHTMLString as buildHTMLStringPure,
  COMMENT_MARKER,
  DATA_SUI_BIND,
  parseAttributeParts as parseAttributePartsFn,
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

// Source pattern for attribute markers — fresh regex per use (`/g` regexes
// carry mutable lastIndex; sharing one across calls is a footgun).
const ATTR_MARKER_PATTERN = `${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`;

// Parse trailing metadata from a closing block marker into serverMeta.
// Reserved suffixes (after the version segment):
//   bN  → branchIndex (which branch the {#if}/{:elseif}/{:else} server picked)
// Unknown segments are ignored. Mutates target in place.
function parseServerMeta(commentData, target) {
  for (const part of commentData.split(':')) {
    if (part.startsWith('b')) {
      target.branchIndex = parseInt(part.slice(1));
    }
  }
}

// buildHTMLStringPure is deterministic for a given (ast, isSVG) pair —
// `snippets` is only echoed back in the result (build-html-string.js:76,
// 202) and doesn't affect htmlString/entries. AST is immutable after
// reaching the Renderer (compiler's optimizeAST runs pre-runtime;
// collectSnippets only reads), so cache entries never go stale.
// WeakMap keyed on the AST array — GC'd automatically when no renderer
// holds the AST.
//
// The cache holds BOTH the string+entries AND a pre-parsed reference
// <template>. Hydration's hot path (hydrateAttributes) reparses the same
// htmlString into a reference DOM via `innerHTML =` — the parse itself
// is ~648ms on a 100-card page per the profile, independent of whether
// the string was cached. Caching the parsed template.content eliminates
// the reparse entirely. Safe because hydrateAttributes only READS from
// refRoot (parallel TreeWalker traversal, no mutations).
//
// Hot path: hydration recurses via hydrateInnerContent → hydrateMarkers
// → hydrateAttributes, each of which needs both the string and parsed
// ref-DOM for the same contentAST. For a 100-item {#each}, that's ~100
// rebuilds + ~100 innerHTML parses of identical content per hydrate
// pass without this cache.
const buildStringCache = new WeakMap();

// Temporary diagnostic — hit/miss counters so we can verify cache
// effectiveness. Expose via globalThis.__cbhCache for inspection.
// TODO remove after perf investigation closes.
const cacheDiag = { hits: 0, misses: 0, firstMissKeys: [] };
if (typeof globalThis !== 'undefined') {
  globalThis.__cbhCache = {
    stats: () => ({ ...cacheDiag, ratio: cacheDiag.hits / (cacheDiag.hits + cacheDiag.misses || 1) }),
    reset: () => {
      cacheDiag.hits = 0;
      cacheDiag.misses = 0;
      cacheDiag.firstMissKeys.length = 0;
    },
  };
}

function cachedBuildHTMLString(ast, options) {
  let entry = buildStringCache.get(ast);
  if (!entry) {
    entry = { html: null, svg: null };
    buildStringCache.set(ast, entry);
  }
  const slot = options.isSVG ? 'svg' : 'html';
  if (entry[slot] === null) {
    cacheDiag.misses++;
    if (cacheDiag.firstMissKeys.length < 10) {
      cacheDiag.firstMissKeys.push({
        astLen: Array.isArray(ast) ? ast.length : '?',
        types: Array.isArray(ast) ? ast.slice(0, 3).map((n) => n?.type) : [],
      });
    }
    const built = buildHTMLStringPure(ast, options);
    // refRoot is a lazy getter — the Plan-04 fast path in hydrateAttributes
    // never reads it, and paying the `template.innerHTML = htmlString`
    // parse per instance is the hydration hotspot we're trying to
    // eliminate. Touch it only when the legacy reference-DOM fallback
    // runs (older SSR output, or templates without data-sui-bind).
    let refRoot = null;
    entry[slot] = {
      htmlString: built.htmlString,
      entries: built.entries,
      snippets: built.snippets,
      get refRoot() {
        if (refRoot === null) {
          const refTemplate = document.createElement('template');
          refTemplate.innerHTML = built.htmlString;
          refRoot = refTemplate.content;
        }
        return refRoot;
      },
    };
  }
  else {
    cacheDiag.hits++;
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

  // Parse an attribute value containing marker tokens into static/dynamic parts.
  // Thin wrapper around the shared helper in build-html-string.js — preserved
  // as an instance method so existing call sites (bindMarkers / ref-DOM
  // fallback in hydrateAttributes) keep the same shape.
  parseAttributeParts(attrValue) {
    return parseAttributePartsFn(attrValue);
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

    // Plan 08 — single-pass walker over SHOW_ELEMENT | SHOW_COMMENT. Each
    // node.nextSibling/firstChild in the walker does one DOM traversal
    // instead of two, cutting the per-render walk cost roughly in half
    // for large fragments (1000-row table, etc.). Attribute processing is
    // safe inline (only touches the element's own attributes); comment
    // processing is deferred because it mutates the tree structure
    // (replace/remove) and would invalidate the live walker.
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
          const { parts, markerIDs } = this.parseAttributeParts(attrValue);
          for (const id of markerIDs) { processedAttrIDs.add(id); }
          this.bindAttributeExpression(element, attrName, parts, entries, data, scope);
        }
      }
      else {
        const text = node.data;
        if (text.startsWith(COMMENT_MARKER)) {
          const markerID = parseInt(text.slice(COMMENT_MARKER.length));
          if (!isNaN(markerID)) {
            // processedAttrIDs is finalized only *after* the walk completes,
            // so defer the attr-ID filter to the processing loop below. In
            // fresh-render shape (client:load), attribute markers and their
            // owning elements are discovered in document order — the element
            // is visited before any comment that would have shared an ID.
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

  // Raw-text element binding — delegates to reactive-data.js.
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

  // Text-expression binding — delegates to reactive-data.js.
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
        this.hydrateBlock(comment, entry, data, scope);
      }
    }
  }

  hydrateAttributes(root, entries, data, scope, ast) {
    // Fast path — server stamped data-sui-bind on every element with
    // dynamic bindings (Plan 04). Presence of the attribute anywhere in
    // the tree tells us the server is Plan-04-aware; walk elements once,
    // look up entries[id].attributeBinding for parts + classification,
    // wire Reactions directly. No reference DOM, no parallel walker, no
    // block-owned-element discovery pass.
    if (root.querySelector && root.querySelector(`[${DATA_SUI_BIND}]`)) {
      this.hydrateAttributesViaDataBind(root, entries, data, scope);
      return;
    }

    // Legacy fallback — reference DOM parallel walk. Keeps older cached
    // SSR content hydrating correctly during a rolling upgrade.
    // Reference DOM is cached alongside the htmlString — parallel TreeWalker
    // only reads attribute names off refEls, so sharing the cached fragment
    // across calls is safe. Eliminates the ~648ms-per-page `innerHTML =`
    // reparse that the profile identified as the hydration hotspot.
    const { refRoot } = cachedBuildHTMLString(ast || this.ast, { snippets: this.snippets });

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

  // Plan 04 fast path — walk SHOW_ELEMENT | SHOW_COMMENT once, process
  // `data-sui-bind` on elements at block-depth 0 and let block hydrate
  // hooks recursively handle their own contents via hydrateInnerContent
  // (which re-enters this method with the block's sub-AST entries). This
  // matches the blockOwnedElements skip the legacy parallel walker
  // performed, but without building a reference DOM or a separate Set —
  // depth is tracked inline from the block markers we encounter.
  //
  // The data-sui-bind attribute itself is left on the element until the
  // post-hydration cleanup pass (base.js removeMarkers, deferred to rAF
  // per Plan 02) strips it along with comment markers.
  hydrateAttributesViaDataBind(root, entries, data, scope) {
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
        else if (text.startsWith('/sui-block:')) {
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
        const { parts } = entry.attributeBinding;
        // Strip `.` / `@` prefix for the DOM attribute name. bindAttribute
        // uses `classification.type` / `classification.attribute` for the
        // real dispatch; the name passed here is only used for the
        // `setAttribute` / `removeAttribute` path of regular-attribute
        // bindings (booleans, interpolated, single-expression strings).
        const domAttrName = (rawAttrName.charAt(0) === '.' || rawAttrName.charAt(0) === '@')
          ? rawAttrName.slice(1)
          : rawAttrName;
        this.bindAttributeExpression(node, domAttrName, parts, entries, data, scope, { skipFirstWrite: true });
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
        else if (next.data.startsWith('/sui-block:')) {
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

  hydrateInnerContent(ownedNodes, contentAST, data, scope) {
    const { entries } = cachedBuildHTMLString(contentAST, { snippets: this.snippets });
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
