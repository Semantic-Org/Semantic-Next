import { Reaction, Signal } from '@semantic-ui/reactivity';
import {
  arrayFromObject,
  assignInPlace,
  each,
  fatal,
  filterObject,
  hashCode,
  inArray,
  isArray,
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

import { ExpressionEvaluator } from '../expression-evaluator.js';
import { DynamicRegion } from './dynamic-region.js';
import { ReactionScope } from './reaction-scope.js';

// Marker for expression placeholders in attribute values
const ATTR_MARKER_PREFIX = '__sui';
const ATTR_MARKER_SUFFIX = '__';

// Marker for text-position expressions (comment nodes)
const COMMENT_MARKER = 'sui:';

// Marker for block-level directive positions
const BLOCK_MARKER = 'sui-block:';

// PreparedTemplate cache — parse once, cloneNode per instance
const templateCache = new Map();

export class Renderer {
  constructor(
    { ast, data, template, subTemplates, snippets, helpers, isSVG = false, inheritsData = true, protectedKeys } = {},
  ) {
    this.ast = ast || [];
    this.data = data;
    this.template = template;
    this.subTemplates = subTemplates;
    this.snippets = snippets || {};
    this.helpers = helpers || {};
    this.isSVG = isSVG;
    this.inheritsData = inheritsData;
    this.protectedKeys = protectedKeys;
    this.id = hashCode({ ast, data, isSVG });
    this.dataVersion = new Signal(0);
    this.scope = new ReactionScope();

    this.evaluator = new ExpressionEvaluator({
      data: this.data,
      helpers: this.helpers,
      dataVersion: this.dataVersion,
    });
  }

  // Evaluate an expression with dataVersion tracking for subtree propagation
  eval(expression, data) {
    this.dataVersion.get();
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

  The key insight: the entire AST (HTML + expressions + block directives)
  is assembled into a single HTML string with markers for ALL dynamic
  positions. This string is parsed ONCE via template.innerHTML, producing
  a correct DOM tree where block markers are positioned inside their
  containing elements. Then a TreeWalker pass wires reactive bindings
  and replaces block markers with live DynamicRegions.
  *******************************/

  readAST({ ast, data, scope, isSVG = this.isSVG }) {
    // Phase 1: Build a single HTML string with markers for everything
    const { htmlString, entries } = this.buildHTMLString(ast);

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

  buildHTMLString(ast) {
    let htmlString = '';
    const entries = []; // { id, type, node, classification }
    let htmlBuffer = ''; // accumulated HTML for binding classification

    const processNodes = (nodes) => {
      for (const node of nodes) {
        switch (node.type) {
          case 'html':
            htmlString += node.html;
            htmlBuffer += node.html;
            break;

          case 'expression': {
            const id = entries.length;
            const classification = this.analyzePosition(htmlBuffer);

            if (classification.insideTag) {
              // Attribute position — string token
              htmlString += `${ATTR_MARKER_PREFIX}${id}${ATTR_MARKER_SUFFIX}`;
            }
            else {
              // Text position — comment marker
              htmlString += `<!--${COMMENT_MARKER}${id}-->`;
            }
            entries.push({ id, type: 'expression', node, classification });
            break;
          }

          case 'svg': {
            // Flatten SVG content inline — the outer <svg> tag is in a preceding html node
            processNodes(node.content);
            break;
          }

          case 'snippet':
            // Register snippet immediately so it's available for later {>name} references
            this.snippets[node.name] = node;
            break;

          case 'slot': {
            if (node.name) {
              htmlString += `<slot name="${node.name}"></slot>`;
            }
            else {
              htmlString += '<slot></slot>';
            }
            break;
          }

          default: {
            // Block-level directives: if, each, async, rerender, template
            // Insert a comment marker at the current position in the HTML
            const id = entries.length;
            htmlString += `<!--${BLOCK_MARKER}${id}-->`;
            entries.push({ id, type: node.type, node });
            break;
          }
        }
      }
    };

    processNodes(ast);
    return { htmlString, entries };
  }

  /*******************************
      Binding Classification
  *******************************/

  analyzePosition(html) {
    let lastOpen = html.lastIndexOf('<');
    let lastClose = html.lastIndexOf('>');

    if (lastOpen <= lastClose) {
      return { type: 'text', insideTag: false, attribute: '', quoted: false };
    }

    const tagFragment = html.slice(lastOpen);

    // Check for .prop= or @event= prefixed attributes
    const specialMatch = tagFragment.match(/\s([.@])([\w-]+)\s*=\s*(['"]?)$/);
    if (specialMatch) {
      const prefix = specialMatch[1];
      const name = specialMatch[2];
      return {
        type: prefix === '.' ? 'property' : 'event',
        insideTag: true,
        attribute: name,
        quoted: specialMatch[3] === '"' || specialMatch[3] === "'",
      };
    }

    const attrMatch = tagFragment.match(/\s([\w-]+)\s*=\s*(['"]?)$/);
    if (attrMatch) {
      const name = attrMatch[1];
      const quoted = attrMatch[2] === '"' || attrMatch[2] === "'";
      return {
        type: quoted ? 'attribute' : 'boolean',
        insideTag: true,
        attribute: name,
        quoted,
      };
    }

    return { type: 'attribute', insideTag: true, attribute: '', quoted: false };
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

  bindMarkers(root, entries, data, scope, ast) {
    if (entries.length === 0) { return; }

    const attrMarkerRegex = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');

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
        const parts = [];
        let lastIndex = 0;
        let match;
        attrMarkerRegex.lastIndex = 0;
        while ((match = attrMarkerRegex.exec(attrValue)) !== null) {
          if (match.index > lastIndex) {
            parts.push({ static: attrValue.slice(lastIndex, match.index) });
          }
          const markerID = parseInt(match[1]);
          parts.push({ markerID });
          processedAttrIDs.add(markerID);
          lastIndex = attrMarkerRegex.lastIndex;
        }
        if (lastIndex < attrValue.length) {
          parts.push({ static: attrValue.slice(lastIndex) });
        }

        const { classification } = entries[parts.find(p => p.markerID !== undefined)?.markerID] || {};
        const bindingType = classification?.type;

        if (bindingType === 'property') {
          const realAttrName = classification.attribute;
          const expr = entries[parts[0].markerID];
          scope.track(Reaction.create((comp) => {
            if (!comp.firstRun && !element.isConnected) {
              comp.stop();
              return;
            }
            const value = this.evaluator.lookupTokenValue(expr.node.value, data);
            element[realAttrName] = value;
          }));
          element.removeAttribute(attrName);
          continue;
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
          continue;
        }

        const isSingleExpr = parts.length === 1 && parts[0].markerID !== undefined;
        const singleEntry = isSingleExpr ? entries[parts[0].markerID] : null;
        const isIfDefined = singleEntry?.node.ifDefined || singleEntry?.classification.type === 'boolean';

        if (isSingleExpr) {
          scope.track(Reaction.create((comp) => {
            if (!comp.firstRun && !element.isConnected) {
              comp.stop();
              return;
            }
            const value = this.eval(singleEntry.node.value, data);

            if (isIfDefined && inArray(value, ['', undefined, null, false, 0])) {
              element.removeAttribute(attrName);
            }
            else {
              const strValue = (isArray(value) || isPlainObject(value))
                ? JSON.stringify(value)
                : String(value ?? '');
              element.setAttribute(attrName, strValue);
            }
            if (inArray(attrName, ['checked', 'selected'])) {
              element[attrName] = Boolean(value);
            }
            if (inArray(attrName, ['value'])) {
              element[attrName] = value ?? '';
            }
          }));
        }
        else {
          // Multi-expression attribute
          scope.track(Reaction.create((comp) => {
            if (!comp.firstRun && !element.isConnected) {
              comp.stop();
              return;
            }
            let value = '';
            for (const part of parts) {
              if (part.static !== undefined) {
                value += part.static;
              }
              else {
                value += this.eval(entries[part.markerID].node.value, data) ?? '';
              }
            }
            element.setAttribute(attrName, value);
          }));
        }
      }
    }

    // Pass 2: Walk comment nodes for text and block markers
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
      else if (type === 'block') {
        this.bindBlockDirective(comment, entry, data, scope);
      }
    }
  }

  /*******************************
        Text Bindings
  *******************************/

  bindTextExpression(comment, entry, data, scope) {
    const exprNode = entry.node;
    const parent = comment.parentNode;

    if (exprNode.unsafeHTML) {
      const ownedNodes = [];
      scope.track(Reaction.create((comp) => {
        if (!comp.firstRun && !comment.isConnected) {
          comp.stop();
          return;
        }
        for (const n of ownedNodes) { n.remove(); }
        ownedNodes.length = 0;
        const value = this.eval(exprNode.value, data);
        if (value != null && value !== '') {
          const parsed = this.parseHTML(String(value));
          const nodes = [...parsed.childNodes];
          comment.after(parsed);
          ownedNodes.push(...nodes);
        }
      }));
    }
    else {
      const textNode = document.createTextNode('');
      parent.replaceChild(textNode, comment);
      scope.track(Reaction.create((comp) => {
        if (!comp.firstRun && !textNode.isConnected) {
          comp.stop();
          return;
        }
        const value = this.eval(exprNode.value, data);
        textNode.data = value ?? '';
      }));
    }
  }

  /*******************************
        Block Directive Binding
  *******************************/

  bindBlockDirective(comment, entry, data, scope) {
    const { node } = entry;
    // The comment sits exactly where the block directive should render.
    // Its parentNode is the correct containing element.
    const parentNode = comment.parentNode;

    switch (node.type) {
      case 'if':
        this.createConditional({ node, data, scope, parentNode, marker: comment });
        break;
      case 'each':
        this.createEach({ node, data, scope, parentNode, marker: comment });
        break;
      case 'async':
        this.createAsync({ node, data, scope, parentNode, marker: comment });
        break;
      case 'rerender':
        this.createRerender({ node, data, scope, parentNode, marker: comment });
        break;
      case 'template': {
        const templateName = this.evaluator.lookupExpressionValue(node.name, data);
        if (this.snippets[templateName]) {
          this.createSnippet({ node, data, scope, parentNode, marker: comment, templateName });
        }
        else {
          this.createSubtemplate({ node, data, scope, parentNode, marker: comment });
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

  createConditional({ node, data, scope, parentNode, marker }) {
    // Use the comment marker as the anchor — replace with a persistent text node
    const region = new DynamicRegion(parentNode, null);
    region.anchor = document.createTextNode('');
    marker.replaceWith(region.anchor);

    let currentBranchIndex = -1;

    scope.track(Reaction.create((comp) => {
      if (!comp.firstRun && !region.anchor.isConnected) {
        comp.stop();
        return;
      }

      const result = this.getBranch(node, data);

      if (result.matchIndex !== currentBranchIndex) {
        currentBranchIndex = result.matchIndex;
        if (result.contentAST) {
          const branchScope = scope.child();
          const branchFragment = this.readAST({ ast: result.contentAST, data, scope: branchScope });
          region.setContent(branchFragment, branchScope);
        }
        else {
          region.clear();
        }
      }
    }));
  }

  getBranch(node, data) {
    const condition = this.eval(node.condition, data);
    if (condition) {
      return { matchIndex: 1000, contentAST: node.content };
    }
    if (node.branches?.length) {
      for (let i = 0; i < node.branches.length; i++) {
        const branch = node.branches[i];
        if (branch.type === 'elseif') {
          if (this.eval(branch.condition, data)) {
            return { matchIndex: i, contentAST: branch.content };
          }
        }
        else if (branch.type === 'else') {
          return { matchIndex: i, contentAST: branch.content };
        }
      }
    }
    return { matchIndex: -1, contentAST: null };
  }

  /*******************************
        List Rendering
  *******************************/

  createEach({ node, data, scope, parentNode, marker }) {
    const region = new DynamicRegion(parentNode, null);
    region.anchor = document.createTextNode('');
    marker.replaceWith(region.anchor);

    const itemMap = new Map();
    let currentKeys = [];
    let showingElse = false;

    scope.track(Reaction.create((comp) => {
      if (!comp.firstRun && !region.anchor.isConnected) {
        comp.stop();
        return;
      }

      const rawItems = this.eval(node.over, data) || [];
      const collectionType = this.getCollectionType(rawItems);
      const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

      if (isEmpty(items) && node.elseContent) {
        this.clearAllItems(itemMap);
        currentKeys = [];
        if (!showingElse) {
          const elseScope = scope.child();
          const elseFragment = this.readAST({ ast: node.elseContent, data, scope: elseScope });
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

      for (const key of currentKeys) {
        if (!newKeys.includes(key)) {
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
        const eachData = this.getEachData(item, i, collectionType, node);

        if (itemMap.has(key)) {
          const entry = itemMap.get(key);
          entry.itemSignal.set(eachData);

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
          const itemScope = scope.child();
          const itemSignal = new Signal(eachData);
          const itemProxy = this.createItemDataProxy(data, itemSignal);

          const itemFragment = this.readAST({
            ast: node.content,
            data: itemProxy,
            scope: itemScope,
          });
          const nodes = [...itemFragment.childNodes];
          insertAfter.after(itemFragment);
          insertAfter = nodes[nodes.length - 1] || insertAfter;
          itemMap.set(key, { nodes, itemSignal, scope: itemScope });
        }
      }

      currentKeys = newKeys;
    }));
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
    if (isString(item)) { return item; }
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

  createAsync({ node, data, scope, parentNode, marker }) {
    const region = new DynamicRegion(parentNode, null);
    region.anchor = document.createTextNode('');
    marker.replaceWith(region.anchor);
    scope.onDispose(() => region.clear());

    let generation = 0;
    let hasResolved = false;
    let resolvedValue = null;

    const renderState = (ast, extraData = {}) => {
      const stateScope = scope.child();
      const stateFragment = this.readAST({
        ast,
        data: { ...data, ...extraData },
        scope: stateScope,
      });
      region.setContent(stateFragment, stateScope);
    };

    scope.track(Reaction.create((comp) => {
      if (!comp.firstRun && !region.anchor.isConnected) {
        comp.stop();
        return;
      }

      const result = this.eval(node.expression, data);
      const currentGen = ++generation;

      if (isPromise(result)) {
        if (node.loadingContent?.length) {
          renderState(node.loadingContent);
        }
        else if (hasResolved && node.content?.length) {
          renderState(node.content, this.createSuccessDataContext(node, resolvedValue));
        }

        result.then(value => {
          if (currentGen < generation) { return; }
          resolvedValue = value;
          hasResolved = true;
          renderState(node.content, this.createSuccessDataContext(node, value));
        }).catch(error => {
          if (currentGen < generation) { return; }
          if (node.errorContent?.length) {
            const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
            renderState(node.errorContent, errorData);
          }
        });
      }
      else {
        resolvedValue = result;
        hasResolved = true;
        renderState(node.content, this.createSuccessDataContext(node, result));
      }
    }));
  }

  createSuccessDataContext(node, value) {
    if (node.as) { return { [node.as]: value }; }
    if (node.parts && isPlainObject(value)) {
      const data = {};
      each(node.parts, (prop) => {
        if (prop in value) { data[prop] = value[prop]; }
      });
      if (node.rest) {
        const restObj = { ...value };
        each(node.parts, (prop) => delete restObj[prop]);
        data[node.rest] = restObj;
      }
      return data;
    }
    return { this: value };
  }

  /*******************************
        Rerender/Guard
  *******************************/

  createRerender({ node, data, scope, parentNode, marker }) {
    const region = new DynamicRegion(parentNode, null);
    region.anchor = document.createTextNode('');
    marker.replaceWith(region.anchor);

    // Initial render
    const initialScope = scope.child();
    const initialFragment = this.readAST({ ast: node.content, data, scope: initialScope });
    region.setContent(initialFragment, initialScope);

    scope.track(Reaction.create((comp) => {
      if (!comp.firstRun && !region.anchor.isConnected) {
        comp.stop();
        return;
      }

      if (node.key) {
        Reaction.guard(() => this.evaluator.lookupTokenValue(node.key, data));
      }
      if (node.expression) {
        this.eval(node.expression, data);
      }

      if (!comp.firstRun) {
        const newScope = scope.child();
        const newFragment = this.readAST({ ast: node.content, data, scope: newScope });
        region.setContent(newFragment, newScope);
      }
    }));
  }

  /*******************************
        Subtemplates
  *******************************/

  createSubtemplate({ node, data, scope, parentNode, marker }) {
    const region = new DynamicRegion(parentNode, null);
    region.anchor = document.createTextNode('');
    marker.replaceWith(region.anchor);

    let currentTemplateID = null;
    let currentInstance = null;

    scope.track(Reaction.create((comp) => {
      if (!comp.firstRun && !region.anchor.isConnected) {
        comp.stop();
        return;
      }

      this.dataVersion.get();
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
          });
        }
      }
      else {
        currentInstance.setDataContext(templateData, { rerender: false });
        currentInstance.render(templateData);
      }
    }));

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

  createSnippet({ node, data, scope, parentNode, marker, templateName }) {
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
    const snippetData = new Proxy(data, {
      get(target, prop) {
        if (typeof prop === 'symbol') { return target[prop]; }
        if (prop in allGetters) { return allGetters[prop](); }
        return target[prop];
      },
      has(target, prop) {
        return (prop in allGetters) || (prop in target);
      },
    });

    const snippetFragment = this.readAST({
      ast: snippet.content,
      data: snippetData,
      scope,
    });

    // Replace marker with snippet content
    marker.replaceWith(snippetFragment);
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
    this.dataVersion.increment();
  }
}
