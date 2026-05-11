import { Dependency } from '@semantic-ui/reactivity';
import { assignInPlace, createCache, filterObject, inArray } from '@semantic-ui/utils';

import {
  ATTR_MARKER_PREFIX,
  buildHTMLString as buildHTMLStringPure,
  DATA_SUI_BIND,
  isBlockClose,
  isBlockOpen,
  isExpressionMarker,
  isRawTextMarker,
  parseAttributeParts as parseAttributePartsFn,
  parseBlockOpenID,
  parseExpressionID,
  parseRawTextID,
  parseServerMeta,
} from '../../build-html-string.js';
import { ExpressionEvaluator } from '../../expression-evaluator.js';
import { getBlock } from './blocks/registry.js';
import { DynamicRegion } from './dynamic-region.js';
import { ReactionScope } from './reaction-scope.js';
import { bindAttribute } from './reactive-data.js';
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
  bindAttributeExpression(element, attrName, parts, entries, data, scope, { skipFirstWrite = false } = {}) {
    bindAttribute({ element, attrName, parts, entries, data, scope, renderer: this, skipFirstWrite });
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
        // Most elements have zero __sui attrs — defer the array allocation
        // until we find one. Collect first, then iterate, because
        // bindAttributeExpression calls element.removeAttribute for property
        // and event bindings, which mutates the live NamedNodeMap.
        let attrsToProcess;
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          if (attr.value.includes(ATTR_MARKER_PREFIX)) {
            (attrsToProcess ??= []).push({ name: attr.name, value: attr.value });
          }
        }
        if (attrsToProcess) {
          for (const { name: attrName, value: attrValue } of attrsToProcess) {
            const { parts, markerIDs } = parseAttributePartsFn(attrValue);
            for (const id of markerIDs) { processedAttrIDs.add(id); }
            this.bindAttributeExpression(element, attrName, parts, entries, data, scope);
          }
        }
      }
      else {
        const text = node.data;
        if (isExpressionMarker(text)) {
          const markerID = parseExpressionID(text);
          if (!isNaN(markerID)) {
            // Filter deferred until after the walk: elements visit before
            // sibling comments in document order, so an attr-marker's
            // owning element is always recorded before any comment that
            // would share its ID.
            commentsToProcess.push({ comment: node, markerID, type: 'expression' });
          }
        }
        else if (isRawTextMarker(text)) {
          const markerID = parseRawTextID(text);
          if (!isNaN(markerID)) {
            commentsToProcess.push({ comment: node, markerID, type: 'rawText' });
          }
        }
        else if (isBlockOpen(text)) {
          const markerID = parseBlockOpenID(text);
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
        // Dispatch via registry — text-position expression routes through
        // blocks/expression.js, which delegates to bindTextExpression for
        // now. Future cleanup may inline the binding logic into the block
        // file and retire the legacy method.
        getBlock('expression')?.({ comment, entry, data, scope, renderer: this });
      }
      else if (type === 'rawText') {
        // Dispatch via registry — the raw-text block self-registers from
        // blocks/raw-text.js. Equivalent to the legacy bindRawTextContent
        // method below (kept for now until reactive-data.js retires).
        getBlock('rawText')?.({ comment, entry, data, scope, renderer: this });
      }
      else if (type === 'block') {
        this.bindBlock(comment, entry, data, scope);
      }
    }
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

      if (isBlockClose(text)) {
        blockDepth--;
        continue;
      }
      if (blockDepth > 0) {
        if (isBlockOpen(text)) {
          blockDepth++;
        }
        continue;
      }

      if (isExpressionMarker(text)) {
        const markerID = parseExpressionID(text);
        if (!isNaN(markerID)) {
          commentsToProcess.push({ comment, markerID, type: 'expression' });
        }
      }
      else if (isBlockOpen(text)) {
        const markerID = parseBlockOpenID(text);
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
        // Registry dispatch with hydrating: true routes to the same
        // expression block; the block delegates to hydrateTextExpression.
        getBlock('expression')?.({ comment, entry, data, scope, renderer: this, hydrating: true });
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
        if (isBlockOpen(text)) {
          blockDepth++;
        }
        else if (isBlockClose(text)) {
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
        const entryId = +binding.slice(eqIdx + 1);
        if (isNaN(entryId)) { continue; }
        const entry = entries[entryId];
        if (!entry || !entry.attributeParts) { continue; }
        const parts = entry.attributeParts;
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

  hydrateBlock(comment, entry, data, scope) {
    const { node } = entry;
    const parentNode = comment.parentNode;

    // Collect all nodes between opening and closing block markers.
    // Track depth because inner blocks (from nested snippets/conditionals)
    // can share marker IDs when scopes reset — match by nesting depth, not ID.
    const ownedNodes = [];
    let next = comment.nextSibling;
    let serverMeta = {};
    let blockDepth = 1;
    while (next) {
      if (next.nodeType === Node.COMMENT_NODE) {
        if (isBlockOpen(next.data)) {
          blockDepth++;
        }
        else if (isBlockClose(next.data)) {
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

    // Move into a temporary fragment so TreeWalker has a connected root.
    const container = document.createDocumentFragment();
    container.append(...ownedNodes);

    this.hydrateMarkers({ root: container, entries, data, scope });

    // hydrateMarkers strips comment markers — rebuild ownedNodes from live container.
    ownedNodes.length = 0;
    ownedNodes.push(...container.childNodes);
  }

  hydrateInto({ region, innerAST, data, scope, asChild = true }) {
    const targetScope = asChild ? scope.child() : scope;
    if (asChild) { region.childScopes.push(targetScope); }

    this.hydrateInnerContent({ ownedNodes: region.ownedNodes, innerAST, data, scope: targetScope });

    if (region.ownedNodes.length > 0) {
      const frag = document.createDocumentFragment();
      frag.append(...region.ownedNodes);
      region.anchor.after(frag);
      region.placeEndAnchor();
    }

    return targetScope;
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
    assignInPlace(this.data, newData, { preserveExistingKeys: preserveExistingData, preserveGetters: true });
  }

  bumpDataVersion() {
    this.dataDep.changed();
    this.notifyUpdate();
  }
}
