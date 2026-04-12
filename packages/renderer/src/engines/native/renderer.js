import { Dependency, Reaction, Signal } from '@semantic-ui/reactivity';
import {
  arrayFromObject,
  assignInPlace,
  each,
  fatal,
  filterObject,
  inArray,
  isArray,
  isDevelopment,
  isEmpty,
  isFunction,
  isPlainObject,
  isPromise,
  isString,
  keys,
  mapObject,
  wrapFunction,
} from '@semantic-ui/utils';

import { Template } from '@semantic-ui/templating';

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
// Side-effect import: every block module self-registers into the block registry.
import './blocks/index.js';

// PreparedTemplate cache — parse once, cloneNode per instance
const TEMPLATE_CACHE_MAX = 1000;
const templateCache = new Map();

function templateCacheGet(key) {
  return templateCache.get(key);
}

function templateCacheSet(key, val) {
  if (templateCache.size >= TEMPLATE_CACHE_MAX) {
    templateCache.clear();
  }
  templateCache.set(key, val);
}

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
    let cached = templateCacheGet(cacheKey);

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
      templateCacheSet(cacheKey, cached);
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

  // Wire reactive bindings for a single attribute expression.
  // `skipFirstWrite` defers DOM writes on firstRun (used during hydration
  // where server content is trusted).
  bindAttributeExpression(element, attrName, parts, entries, data, scope, { skipFirstWrite = false } = {}) {
    const { classification } = entries[parts.find(p => p.markerID !== undefined)?.markerID] || {};
    const bindingType = classification?.type;

    if (bindingType === 'property') {
      const realAttrName = classification.attribute;
      const expr = entries[parts[0].markerID];
      scope.reaction(element, (comp) => {
        const value = this.evaluator.lookupTokenValue(expr.node.value, data);
        if (skipFirstWrite && comp.firstRun) { return; }
        element[realAttrName] = value;
      });
      element.removeAttribute(attrName);
      return;
    }

    if (bindingType === 'event') {
      const realAttrName = classification.attribute;
      const expr = entries[parts[0].markerID];
      const handler = (...args) => {
        const value = this.evaluator.lookupTokenValue(expr.node.value, data);
        if (isFunction(value)) { value(...args); }
      };
      element.addEventListener(realAttrName, handler);
      scope.onDispose(() => element.removeEventListener(realAttrName, handler));
      element.removeAttribute(attrName);
      return;
    }

    const isSingleExpr = parts.length === 1 && parts[0].markerID !== undefined;
    const singleEntry = isSingleExpr ? entries[parts[0].markerID] : null;
    const isIfDefined = singleEntry?.node.ifDefined || singleEntry?.classification.type === 'boolean';

    if (isSingleExpr) {
      scope.reaction(element, (comp) => {
        const value = this.lookupExpression(singleEntry.node.value, data);
        if (skipFirstWrite && comp.firstRun) { return; }

        if (isIfDefined && !value) {
          element.removeAttribute(attrName);
        }
        else {
          const strValue = (isArray(value) || isPlainObject(value))
            ? JSON.stringify(value)
            : String(value ?? '');
          if (element.getAttribute(attrName) !== strValue) {
            element.setAttribute(attrName, strValue);
          }
        }
        if (attrName === 'checked' || attrName === 'selected') {
          const boolValue = Boolean(value);
          if (element[attrName] !== boolValue) {
            element[attrName] = boolValue;
          }
        }
        else if (attrName === 'value') {
          const newValue = value ?? '';
          if (element[attrName] !== newValue) {
            element[attrName] = newValue;
          }
        }
      });
    }
    else {
      scope.reaction(element, (comp) => {
        if (skipFirstWrite && comp.firstRun) {
          // Evaluate all expressions to register Signal dependencies,
          // but skip the DOM write — server content is trusted
          for (const part of parts) {
            if (part.markerID !== undefined) {
              this.lookupExpression(entries[part.markerID].node.value, data);
            }
          }
          return;
        }
        let value = '';
        for (const part of parts) {
          if (part.static !== undefined) {
            value += part.static;
          }
          else {
            value += this.lookupExpression(entries[part.markerID].node.value, data) ?? '';
          }
        }
        element.setAttribute(attrName, value);
      });
    }
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

  // Bind reactive content for raw text elements (script, style, textarea, title).
  // The browser treats their content as text, not markup, so we can't use
  // comment markers inside them. Instead, the entire content is evaluated
  // as a string from the collected AST nodes and set via textContent.
  bindRawTextContent(comment, entry, data, scope) {
    // Walk backwards past whitespace text nodes to find the raw text element
    let element = comment.previousSibling;
    while (element && element.nodeType === Node.TEXT_NODE) {
      element = element.previousSibling;
    }
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      comment.remove();
      return;
    }

    comment.remove();

    scope.reaction(element, () => {
      element.textContent = this.evaluateRawTextNodes(entry.nodes, data);
    });
  }

  // Evaluate AST nodes into a plain text string — used for content inside
  // raw text elements where DOM nodes can't exist. Mirrors the ServerRenderer's
  // evaluation logic but uses the reactive expression evaluator so Signal
  // dependencies are tracked inside Reactions.
  evaluateRawTextNodes(nodes, data) {
    let result = '';
    for (const node of nodes) {
      switch (node.type) {
        case 'html':
          result += node.html;
          break;
        case 'expression':
          if (node.unsafeHTML) {
            result += String(this.lookupExpression(node.value, data) ?? '');
          }
          else {
            result += String(this.lookupExpression(node.value, data) ?? '');
          }
          break;
        case 'if': {
          const condition = this.lookupExpression(node.condition, data);
          if (condition && node.content) {
            result += this.evaluateRawTextNodes(node.content, data);
          }
          else if (node.branches) {
            for (const branch of node.branches) {
              if (branch.type === 'elseif' && this.lookupExpression(branch.condition, data)) {
                result += this.evaluateRawTextNodes(branch.content, data);
                break;
              }
              if (branch.type === 'else') {
                result += this.evaluateRawTextNodes(branch.content, data);
                break;
              }
            }
          }
          break;
        }
        case 'each': {
          const items = this.lookupExpression(node.over, data) || [];
          const list = isArray(items) ? items : arrayFromObject(items);
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const eachData = Object.create(data);
            if (node.as) {
              eachData[node.as] = item;
            }
            else {
              Object.assign(eachData, item);
              eachData.this = item;
            }
            eachData[node.indexAs || 'index'] = i;
            result += this.evaluateRawTextNodes(node.content, eachData);
          }
          break;
        }
        case 'template': {
          const templateName = this.evaluator.lookupExpressionValue(node.name, data);
          const snippet = this.snippets[templateName];
          if (snippet) {
            result += this.evaluateRawTextNodes(snippet.content, data);
          }
          break;
        }
      }
    }
    return result;
  }

  /*******************************
        Text Bindings
  *******************************/

  bindTextExpression(comment, entry, data, scope) {
    const exprNode = entry.node;
    const parent = comment.parentNode;

    if (exprNode.unsafeHTML) {
      const anchor = document.createTextNode('');
      comment.replaceWith(anchor);
      const ownedNodes = [];
      scope.reaction(anchor, () => {
        for (const n of ownedNodes) { n.remove(); }
        ownedNodes.length = 0;
        const value = this.lookupExpression(exprNode.value, data);
        if (value != null && value !== '') {
          const parsed = this.parseHTML(String(value));
          const nodes = [...parsed.childNodes];
          anchor.after(parsed);
          ownedNodes.push(...nodes);
        }
      });
    }
    else if (exprNode.literalValue) {
      const value = this.evaluator.lookupTokenValue(exprNode.value, data);
      const textNode = document.createTextNode(value ?? '');
      parent.replaceChild(textNode, comment);
    }
    else {
      const textNode = document.createTextNode('');
      parent.replaceChild(textNode, comment);
      scope.reaction(textNode, () => {
        const value = this.lookupExpression(exprNode.value, data);
        textNode.data = value ?? '';
      });
    }
  }

  /*******************************
        Block Directive Binding
  *******************************/

  bindBlockDirective(comment, entry, data, scope) {
    const { node, isSVG } = entry;
    // The comment sits exactly where the block directive should render.
    // Its parentNode is the correct containing element.
    const parentNode = comment.parentNode;

    switch (node.type) {
      case 'if':
        this.bindBlockViaRegistry({ node, data, scope, comment, isSVG });
        break;
      case 'each':
        this.createEach({ node, data, scope, parentNode, marker: comment, isSVG });
        break;
      case 'async':
        this.bindBlockViaRegistry({ node, data, scope, comment, isSVG });
        break;
      case 'rerender':
        this.bindBlockViaRegistry({ node, data, scope, comment, isSVG });
        break;
      case 'template': {
        const templateName = this.evaluator.lookupExpressionValue(node.name, data);
        if (this.snippets[templateName]) {
          this.createSnippet({ node, data, scope, parentNode, marker: comment, templateName, isSVG });
        }
        else {
          this.createSubtemplate({ node, data, scope, parentNode, marker: comment, isSVG });
        }
        break;
      }
      case 'snippet':
        this.snippets[node.name] = node;
        break;
    }
  }

  /*******************************
        Conditional Rendering
  *******************************/

  /*******************************
        List Rendering
  *******************************/

  createEach({ node, data, scope, parentNode, marker, isSVG }) {
    const region = new DynamicRegion(parentNode, marker);

    const itemMap = new Map();
    let currentKeys = [];
    let showingElse = false;

    scope.onDispose(() => {
      this.clearAllItems(itemMap);
      region.clear();
    });

    scope.reaction(region.anchor, (comp) => {
      const rawItems = this.lookupExpression(node.over, data) || [];
      const collectionType = this.getCollectionType(rawItems);
      const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

      if (isEmpty(items) && node.elseContent) {
        this.clearAllItems(itemMap);
        currentKeys = [];
        if (!showingElse) {
          const elseScope = scope.child();
          const elseFragment = this.readAST({ ast: node.elseContent, data, scope: elseScope, isSVG });
          region.setContent(elseFragment, elseScope);
          showingElse = true;
        }
        return;
      }

      if (showingElse) {
        region.clear();
        showingElse = false;
      }

      const newKeys = items.map((item, i) => this.getItemID(item, i, collectionType));
      const newKeySet = new Set(newKeys);

      for (const key of currentKeys) {
        if (!newKeySet.has(key)) {
          const entry = itemMap.get(key);
          entry.scope.dispose();
          for (const n of entry.nodes) { n.remove(); }
          itemMap.delete(key);
        }
      }

      let insertAfter = region.anchor;

      for (let i = 0; i < newKeys.length; i++) {
        const key = newKeys[i];
        const item = items[i];

        if (itemMap.has(key)) {
          const entry = itemMap.get(key);

          if (entry.item !== item || entry.index !== i) {
            // Different reference or position — set() with deep equality
            // so unchanged cloned items don't trigger spurious re-renders
            const eachData = this.getEachData(item, i, collectionType, node);
            entry.itemSignal.set(eachData);
            entry.item = item;
            entry.index = i;
          }
          else if (typeof item === 'object') {
            // Same reference at same position — properties may have been
            // mutated in place. Deep equality can't detect this (a === b
            // short-circuits), so force-notify dependents.
            entry.itemSignal.notify();
          }

          const firstItemNode = entry.nodes[0];
          if (firstItemNode && firstItemNode.previousSibling !== insertAfter) {
            for (const n of entry.nodes) {
              insertAfter.after(n);
              insertAfter = n;
            }
          }
          else {
            insertAfter = entry.nodes[entry.nodes.length - 1] || insertAfter;
          }
        }
        else {
          const eachData = this.getEachData(item, i, collectionType, node);
          const itemScope = scope.child();
          const itemSignal = new Signal(eachData, { allowClone: false });
          const itemProxy = this.createItemDataProxy(data, itemSignal);

          const itemFragment = this.readAST({
            ast: node.content,
            data: itemProxy,
            scope: itemScope,
            isSVG,
          });
          const nodes = [...itemFragment.childNodes];
          insertAfter.after(itemFragment);
          insertAfter = nodes[nodes.length - 1] || insertAfter;
          itemMap.set(key, { nodes, itemSignal, scope: itemScope, item, index: i });
        }
      }

      currentKeys = newKeys;
    });
  }

  createItemDataProxy(parentData, itemSignal) {
    return new Proxy(parentData, {
      get(target, prop) {
        if (prop === '__isItemProxy') { return true; }
        if (typeof prop === 'symbol') { return target[prop]; }
        const itemData = itemSignal.value;
        if (prop in itemData) { return itemData[prop]; }
        return target[prop];
      },
      has(target, prop) {
        if (prop === '__isItemProxy') { return true; }
        const itemData = itemSignal.peek();
        return (prop in itemData) || (prop in target);
      },
    });
  }

  getCollectionType(items) {
    return isArray(items) ? 'array' : 'object';
  }

  getItemID(item, indexOrKey, collectionType) {
    if (isPlainObject(item)) {
      const key = (collectionType === 'object') ? indexOrKey : undefined;
      return key || item._id || item.id || item.key || item.hash || item._hash || item.value || indexOrKey;
    }
    if (isString(item)) { return item + ':' + indexOrKey; }
    return indexOrKey;
  }

  getEachData(item, indexOrKey, collectionType, node) {
    let { as, indexAs } = node;
    if (!indexAs) {
      indexAs = (collectionType === 'array') ? 'index' : 'key';
    }
    if (collectionType === 'object') {
      indexOrKey = item.key;
      item = item.value;
    }
    return as
      ? { [as]: item, [indexAs]: indexOrKey }
      : { ...item, this: item, [indexAs]: indexOrKey };
  }

  clearAllItems(itemMap) {
    for (const entry of itemMap.values()) {
      entry.scope.dispose();
      for (const n of entry.nodes) { n.remove(); }
    }
    itemMap.clear();
  }

  /*******************************
        Async Rendering
  *******************************/

  /*******************************
        Rerender/Guard
  *******************************/

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
        Subtemplates
  *******************************/

  createSubtemplate({ node, data, scope, parentNode, marker, isSVG }) {
    const region = new DynamicRegion(parentNode, marker);

    let currentTemplateID = null;
    let currentInstance = null;

    scope.reaction(region.anchor, (comp) => {
      this.dataDep.depend();
      const templateOrName = this.evaluator.lookupExpressionValue(node.name, data);
      const templateData = this.unpackNodeData(node, data);

      let template, templateName;
      if (isString(templateOrName)) {
        templateName = templateOrName;
        template = this.subTemplates?.[templateName];
      }
      else if (templateOrName instanceof Template) {
        template = templateOrName;
        templateName = template.templateName;
      }

      if (!template) {
        if (currentInstance) {
          currentInstance.onDestroyed();
          currentInstance = null;
          currentTemplateID = null;
          region.clear();
        }
        return;
      }

      if (template.id !== currentTemplateID) {
        if (currentInstance) { currentInstance.onDestroyed(); }

        currentTemplateID = template.id;
        currentInstance = template.clone({
          templateName,
          subTemplates: this.subTemplates,
          data: templateData,
          parentTemplate: this.template,
          renderingEngine: 'native',
        });

        if (this.template?.element) {
          currentInstance.setElement(this.template.element);
        }
        if (this.template) { currentInstance.setParent(this.template); }

        currentInstance.initialize();
        const templateFragment = currentInstance.render();
        region.setContent(templateFragment);

        const renderRoot = this.template?.element?.renderRoot;
        if (renderRoot) {
          currentInstance.attach(renderRoot, {
            parentNode: region.parentNode,
            startNode: region.anchor,
            endNode: region.endAnchor || region.getLastNode(),
          });
        }
      }
      else {
        currentInstance.setDataContext(templateData, { rerender: false });
        currentInstance.render(templateData);
      }
    });

    scope.onDispose(() => {
      if (currentInstance) {
        currentInstance.onDestroyed();
        currentInstance = null;
      }
    });
  }

  hydrateSubtemplate({ node, data, scope, region, ownedNodes }) {
    const templateOrName = this.evaluator.lookupExpressionValue(node.name, data);
    const templateData = this.unpackNodeData(node, data);

    let template, templateName;
    if (isString(templateOrName)) {
      templateName = templateOrName;
      template = this.subTemplates?.[templateName];
    }
    else if (templateOrName instanceof Template) {
      template = templateOrName;
      templateName = template.templateName;
    }

    if (!template) { return; }

    let currentTemplateID = template.id;
    let currentInstance = template.clone({
      templateName,
      subTemplates: this.subTemplates,
      data: templateData,
      parentTemplate: this.template,
      renderingEngine: 'native',
    });

    if (this.template?.element) {
      currentInstance.setElement(this.template.element);
    }
    if (this.template) { currentInstance.setParent(this.template); }

    currentInstance.initialize();

    // Hydrate inner markers on the server-rendered DOM instead of rendering fresh
    if (ownedNodes.length > 0) {
      const { entries } = currentInstance.renderer.buildHTMLString(currentInstance.ast);
      if (entries.length > 0) {
        const container = document.createDocumentFragment();
        for (const n of [...ownedNodes]) { container.appendChild(n); }
        currentInstance.renderer.hydrateMarkers(
          container,
          entries,
          currentInstance.renderer.data,
          currentInstance.renderer.scope,
        );
        // Put nodes back
        const frag = document.createDocumentFragment();
        for (const n of [...container.childNodes]) { frag.appendChild(n); }
        region.anchor.after(frag);
        // Recollect from DOM — frag is consumed after insertion
        const collected = [];
        let sibling = region.anchor.nextSibling;
        while (sibling) {
          collected.push(sibling);
          sibling = sibling.nextSibling;
        }
        region.ownedNodes = collected;
      }
    }

    currentInstance.rendered = true;
    const renderRoot = this.template?.element?.renderRoot;
    if (renderRoot) {
      currentInstance.attach(renderRoot, {
        parentNode: region.parentNode,
        startNode: region.ownedNodes[0],
        endNode: region.getLastNode(),
      });
    }

    // Wire the same Reaction as createSubtemplate for future data updates
    scope.reaction(region.anchor, (comp) => {
      this.dataDep.depend();
      const templateOrName = this.evaluator.lookupExpressionValue(node.name, data);
      const templateData = this.unpackNodeData(node, data);

      let template;
      if (isString(templateOrName)) {
        template = this.subTemplates?.[templateOrName];
      }
      else if (templateOrName instanceof Template) {
        template = templateOrName;
      }

      if (!template) {
        if (currentInstance) {
          currentInstance.onDestroyed();
          currentInstance = null;
          currentTemplateID = null;
          region.clear();
        }
        return;
      }

      if (template.id !== currentTemplateID) {
        if (currentInstance) { currentInstance.onDestroyed(); }
        currentTemplateID = template.id;
        currentInstance = template.clone({
          templateName: template.templateName,
          subTemplates: this.subTemplates,
          data: templateData,
          parentTemplate: this.template,
          renderingEngine: 'native',
        });
        if (this.template?.element) { currentInstance.setElement(this.template.element); }
        if (this.template) { currentInstance.setParent(this.template); }
        currentInstance.initialize();
        const templateFragment = currentInstance.render();
        region.setContent(templateFragment);
        if (renderRoot) {
          currentInstance.attach(renderRoot, {
            parentNode: region.parentNode,
            startNode: region.anchor,
            endNode: region.endAnchor || region.getLastNode(),
          });
        }
      }
      else if (!comp.firstRun) {
        currentInstance.setDataContext(templateData, { rerender: false });
        currentInstance.render(templateData);
      }
    });

    scope.onDispose(() => {
      if (currentInstance) {
        currentInstance.onDestroyed();
        currentInstance = null;
      }
    });
  }

  /*******************************
        Snippets
  *******************************/

  createSnippet({ node, data, scope, parentNode, marker, templateName, isSVG }) {
    const snippet = this.snippets[templateName];
    if (!snippet) {
      fatal(`Snippet "${templateName}" not found`);
    }

    const evaluator = this.evaluator;
    const staticGetters = {};
    const reactiveGetters = {};

    if (node.data) {
      if (isString(node.data)) {
        const evaluated = evaluator.lookupExpressionValue(node.data, data);
        if (isPlainObject(evaluated)) {
          each(evaluated, (val, key) => {
            staticGetters[key] = () => val;
          });
        }
      }
      else if (isPlainObject(node.data)) {
        each(node.data, (expr, key) => {
          staticGetters[key] = () => evaluator.lookupExpressionValue(expr, data);
        });
      }
    }
    if (node.reactiveData) {
      each(node.reactiveData, (expr, key) => {
        reactiveGetters[key] = () => evaluator.lookupExpressionValue(expr, data);
      });
    }

    const allGetters = { ...staticGetters, ...reactiveGetters };
    const getterKeys = keys(allGetters);
    const snippetData = new Proxy(data, {
      get(target, prop) {
        if (typeof prop === 'symbol') { return target[prop]; }
        if (prop in allGetters) { return allGetters[prop](); }
        return target[prop];
      },
      has(target, prop) {
        return (prop in allGetters) || (prop in target);
      },
      ownKeys(target) {
        return [...new Set([...getterKeys, ...Reflect.ownKeys(target)])];
      },
      getOwnPropertyDescriptor(target, prop) {
        if (prop in allGetters) {
          return { configurable: true, enumerable: true, get: allGetters[prop] };
        }
        return Object.getOwnPropertyDescriptor(target, prop);
      },
    });

    const snippetFragment = this.readAST({
      ast: snippet.content,
      data: snippetData,
      scope,
      isSVG,
    });

    // Replace marker with snippet content
    marker.replaceWith(snippetFragment);
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

  hydrateTextExpression(comment, entry, data, scope) {
    const exprNode = entry.node;

    if (exprNode.unsafeHTML) {
      // Collect server-rendered nodes after the comment until next marker
      const ownedNodes = [];
      let next = comment.nextSibling;
      while (
        next && !(next.nodeType === Node.COMMENT_NODE
          && (next.data.startsWith(COMMENT_MARKER) || next.data.startsWith(BLOCK_MARKER)
            || next.data.startsWith('/sui-block')))
      ) {
        ownedNodes.push(next);
        next = next.nextSibling;
      }

      // Replace comment with text node anchor so removeMarkers() doesn't orphan it
      const anchor = document.createTextNode('');
      comment.replaceWith(anchor);

      scope.reaction(anchor, (comp) => {
        this.lookupExpression(exprNode.value, data); // register deps (even on firstRun)
        if (comp.firstRun) { return; } // skip expensive reparse — server DOM is trusted
        for (const n of ownedNodes) { n.remove(); }
        ownedNodes.length = 0;
        const value = this.lookupExpression(exprNode.value, data);
        if (value != null && value !== '') {
          const parsed = this.parseHTML(String(value));
          const nodes = [...parsed.childNodes];
          anchor.after(parsed);
          ownedNodes.push(...nodes);
        }
      });
    }
    else {
      // The server output is: <!--sui:v1:0-->VALUE + static text...
      // The browser merges VALUE with any following static text into one text node.
      // We need to split: adopt VALUE portion as a reactive text node, preserve the rest.
      const nextNode = comment.nextSibling;

      let textNode;
      if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
        const serverValue = String(this.lookupExpression(exprNode.value, data) ?? '');
        const fullText = nextNode.data;

        if (fullText.length > serverValue.length && fullText.startsWith(serverValue)) {
          // Split at the boundary between value and static text
          // splitText returns the NEW node (remainder), original keeps the first part
          nextNode.splitText(serverValue.length);
          textNode = nextNode; // first part = the value
        }
        else {
          textNode = nextNode;
        }
        comment.remove();
      }
      else {
        textNode = document.createTextNode('');
        comment.replaceWith(textNode);
      }

      scope.reaction(textNode, (comp) => {
        if (comp.firstRun) {
          this.lookupExpression(exprNode.value, data);
          return;
        }
        const value = this.lookupExpression(exprNode.value, data);
        textNode.data = value ?? '';
      });
    }
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

    // Create DynamicRegion with server-rendered content
    const region = new DynamicRegion(parentNode, comment);
    region.ownedNodes = ownedNodes;

    // Converted blocks own their hydration — the block's hydrate hook walks
    // region.ownedNodes, recurses into nested markers, and moves nodes into
    // the region. Legacy blocks (each, async, non-snippet template) still
    // rely on the renderer pre-processing the region before dispatch.
    const block = getBlock(node.type);
    if (block) {
      block({ node, data, scope, region, renderer: this, isSVG: entry.isSVG, serverMeta, hydrating: true });
      return;
    }

    // Legacy path: hydrate inner markers then move nodes into region.
    // This path goes away in step 8 once every block type is converted.
    const contentAST = this.getServerRenderedAST(node, data);
    if (contentAST && ownedNodes.length > 0) {
      const innerScope = scope.child();
      region.childScopes.push(innerScope);
      this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
      const frag = document.createDocumentFragment();
      for (const n of ownedNodes) { frag.appendChild(n); }
      region.anchor.after(frag);
      region.ownedNodes = [...ownedNodes];
    }

    switch (node.type) {
      case 'each':
        this.hydrateEach({ node, data, scope, region });
        break;
      case 'template': {
        const templateName = this.evaluator.lookupExpressionValue(node.name, data);
        if (this.snippets[templateName]) {
          // Snippet invocation — hydrate through the rerender block with
          // the snippet's content. Step 7 consolidates this.
          const rerenderBlock = getBlock('rerender');
          rerenderBlock({
            node: { ...node, content: this.snippets[templateName].content, expression: null, key: null },
            data,
            scope,
            region,
            renderer: this,
            isSVG: entry.isSVG,
            serverMeta,
            hydrating: true,
          });
        }
        else {
          this.hydrateSubtemplate({ node, data, scope, region, ownedNodes });
        }
        break;
      }
    }
  }

  getServerRenderedAST(node, data) {
    switch (node.type) {
      case 'if': {
        const condition = this.lookupExpression(node.condition, data);
        if (condition) { return node.content; }
        if (node.branches) {
          for (const branch of node.branches) {
            if (branch.type === 'elseif' && this.lookupExpression(branch.condition, data)) {
              return branch.content;
            }
            if (branch.type === 'else') { return branch.content; }
          }
        }
        return null;
      }
      case 'async':
        return node.loadingContent;
      case 'rerender':
        return node.content;
      case 'template': {
        const templateName = this.evaluator.lookupExpressionValue(node.name, data);
        if (this.snippets[templateName]) {
          return this.snippets[templateName].content;
        }
        return null; // subtemplates handled separately
      }
      default:
        return null; // each handled separately (per-item data)
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

  hydrateEach({ node, data, scope, region }) {
    // On first run: evaluate to establish dependencies, skip rendering.
    // On subsequent runs: full re-render of the entire list.
    scope.reaction(region.anchor, (comp) => {
      const rawItems = this.lookupExpression(node.over, data) || [];
      const collectionType = this.getCollectionType(rawItems);
      const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

      if (comp.firstRun) {
        return; // server content is correct
      }

      if (isEmpty(items) && node.elseContent) {
        const elseScope = scope.child();
        const elseFragment = this.readAST({ ast: node.elseContent, data, scope: elseScope });
        region.setContent(elseFragment, elseScope);
      }
      else {
        const fragment = document.createDocumentFragment();
        const listScope = scope.child();
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const eachData = this.getEachData(item, i, collectionType, node);
          const itemSignal = new Signal(eachData, { allowClone: false });
          const itemProxy = this.createItemDataProxy(data, itemSignal);
          const itemScope = listScope.child();
          const itemFragment = this.readAST({ ast: node.content, data: itemProxy, scope: itemScope });
          fragment.append(itemFragment);
        }
        region.setContent(fragment, listScope);
      }
    });
  }

  /*******************************
        Subtemplate Data
  *******************************/

  unpackNodeData(node, data) {
    let templateData = {};

    if (node.data) {
      if (isString(node.data)) {
        const evaluated = this.evaluator.lookupExpressionValue(node.data, data);
        if (isPlainObject(evaluated)) {
          templateData = { ...templateData, ...evaluated };
        }
      }
      else if (isPlainObject(node.data)) {
        each(node.data, (expr, key) => {
          templateData[key] = data.__isItemProxy
            ? this.evaluator.lookupExpressionValue(expr, data)
            : Reaction.nonreactive(() => this.evaluator.lookupExpressionValue(expr, data));
        });
      }
    }

    if (node.reactiveData) {
      each(node.reactiveData, (expr, key) => {
        templateData[key] = this.evaluator.lookupExpressionValue(expr, data);
      });
    }

    return templateData;
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
