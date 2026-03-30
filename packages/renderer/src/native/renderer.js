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

// DOM properties that diverge from HTML attributes after user interaction
const BOOLEAN_SYNCED_ATTRS = ['checked', 'selected'];
const STRING_SYNCED_ATTRS = ['value'];

// Marker for expression placeholders — must survive innerHTML parsing
// Text positions use comment markers: <!--sui:0-->
// Attribute positions use a unique string: __sui0__
const COMMENT_MARKER = 'sui:';
const ATTR_MARKER_PREFIX = '__sui';
const ATTR_MARKER_SUFFIX = '__';

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
    const version = this.dataVersion.get();
    const result = this.evaluator.lookupExpressionValue(expression, data);
    return result;
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

  readAST({ ast, data, scope, isSVG = this.isSVG }) {
    const fragment = document.createDocumentFragment();

    // Process the AST in segments — each segment is a run of html+expression
    // nodes (inline content), separated by block-level directives.
    let i = 0;
    while (i < ast.length) {
      const node = ast[i];

      // Block-level nodes get their own handling
      if (this.isBlockNode(node)) {
        const lastNode = this.getLastNode(fragment);
        switch (node.type) {
          case 'if':
            this.createConditional({ node, data, scope, fragment, lastNode });
            break;
          case 'each':
            this.createEach({ node, data, scope, fragment, lastNode });
            break;
          case 'async':
            this.createAsync({ node, data, scope, fragment, lastNode });
            break;
          case 'rerender':
            this.createRerender({ node, data, scope, fragment, lastNode });
            break;
          case 'template': {
            const templateName = this.evaluator.lookupExpressionValue(node.name, data);
            if (this.snippets[templateName]) {
              this.createSnippet({ node, data, scope, fragment, lastNode, templateName });
            }
            else {
              this.createSubtemplate({ node, data, scope, fragment, lastNode });
            }
            break;
          }
          case 'snippet':
            this.snippets[node.name] = node;
            break;
          case 'slot': {
            const slot = document.createElement('slot');
            if (node.name) { slot.setAttribute('name', node.name); }
            fragment.append(slot);
            break;
          }
            // svg is handled inline in segment collection, not as a block node
        }
        i++;
        continue;
      }

      // Collect a contiguous segment of html + expression + svg nodes
      const segment = [];
      while (i < ast.length && !this.isBlockNode(ast[i])) {
        const current = ast[i];
        if (current.type === 'svg') {
          // Flatten SVG content into the segment — the outer <svg> tag
          // is already in a preceding html node, SVG content goes inside it
          for (const svgNode of current.content) {
            segment.push(svgNode);
          }
        }
        else {
          segment.push(current);
        }
        i++;
      }

      if (segment.length > 0) {
        this.renderSegment({ segment, data, scope, fragment, isSVG });
      }
    }

    return fragment;
  }

  isBlockNode(node) {
    return inArray(node.type, ['if', 'each', 'async', 'rerender', 'template', 'snippet', 'slot']);
  }

  /*******************************
      Segment Rendering
      (HTML + Expression batches)
  *******************************/

  renderSegment({ segment, data, scope, fragment, isSVG }) {
    // First pass: classify each expression as text or attribute
    const classifications = this.classifyBindings(segment);

    // Build HTML string with appropriate markers
    let htmlString = '';
    const expressions = [];
    let exprIndex = 0;

    for (const node of segment) {
      if (node.type === 'html') {
        htmlString += node.html;
      }
      else if (node.type === 'expression') {
        const id = expressions.length;
        const classification = classifications[exprIndex++];

        if (classification.insideTag) {
          // Attribute position — use string token (survives in attribute values)
          htmlString += `${ATTR_MARKER_PREFIX}${id}${ATTR_MARKER_SUFFIX}`;
        }
        else {
          // Text position — use comment marker
          htmlString += `<!--${COMMENT_MARKER}${id}-->`;
        }
        expressions.push({ node, classification });
      }
    }

    if (!htmlString && expressions.length === 0) { return; }

    // Parse the HTML
    const parsed = this.parseHTML(htmlString, isSVG);

    // Bind all markers
    this.bindAllMarkers(parsed, expressions, data, scope);

    fragment.append(parsed);
  }

  parseHTML(htmlString, isSVG = false) {
    if (isSVG) {
      const wrapper = document.createElement('template');
      wrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${htmlString}</svg>`;
      const svgEl = wrapper.content.firstChild;
      const frag = document.createDocumentFragment();
      while (svgEl.firstChild) { frag.append(svgEl.firstChild); }
      return frag;
    }

    const template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content;
  }

  /*******************************
       Binding Classification
  *******************************/

  classifyBindings(ast) {
    let htmlBuffer = '';
    const classifications = [];

    for (const node of ast) {
      if (node.type === 'html') {
        htmlBuffer += node.html;
      }
      else if (node.type === 'expression') {
        const ctx = this.analyzePosition(htmlBuffer);
        classifications.push(ctx);
      }
    }
    return classifications;
  }

  analyzePosition(html) {
    // Find the last unmatched < to determine if we're inside a tag
    let lastOpen = html.lastIndexOf('<');
    let lastClose = html.lastIndexOf('>');

    if (lastOpen <= lastClose) {
      return { type: 'text', insideTag: false, attribute: '', quoted: false };
    }

    // We are inside a tag — extract context
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

    // Check for regular attribute
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
      Marker Binding
  *******************************/

  bindAllMarkers(root, expressions, data, scope) {
    if (expressions.length === 0) { return; }

    // Use this.data for top-level renders so Reactions see updates via setData/assignInPlace.
    // For subtree renders (each items, snippets), data is a different object (proxy/overlay)
    // and the Reaction should use that directly.
    const attrMarkerRegex = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');

    // Pass 1: Find and bind attribute markers on elements
    const processedAttrIDs = new Set();
    const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let el;
    while ((el = elementWalker.nextNode())) {
      const attrsToProcess = [];
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (attr.value.includes(ATTR_MARKER_PREFIX)) {
          attrsToProcess.push({ name: attr.name, value: attr.value });
        }
      }

      // Capture element reference per-iteration for closures
      const element = el;
      for (const { name: attrName, value: attrValue } of attrsToProcess) {
        // Parse the attribute value into parts (static + expression markers)
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

        // Determine the actual attribute name (strip . or @ prefixes parsed by browser)
        let realAttrName = attrName;
        const { classification } = expressions[parts.find(p => p.markerID !== undefined)?.markerID] || {};
        const bindingType = classification?.type;

        if (bindingType === 'property') {
          realAttrName = classification.attribute;
          const expr = expressions[parts[0].markerID];
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
          realAttrName = classification.attribute;
          const expr = expressions[parts[0].markerID];
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
        const singleExpr = isSingleExpr ? expressions[parts[0].markerID] : null;
        const isIfDefined = singleExpr?.node.ifDefined || singleExpr?.classification.type === 'boolean';

        if (isSingleExpr) {
          scope.track(Reaction.create((comp) => {
            if (!comp.firstRun && !element.isConnected) {
              comp.stop();
              return;
            }
            const value = this.eval(singleExpr.node.value, data);

            if (isIfDefined && inArray(value, ['', undefined, null, false, 0])) {
              element.removeAttribute(attrName);
            }
            else {
              const strValue = (isArray(value) || isPlainObject(value))
                ? JSON.stringify(value)
                : String(value ?? '');
              element.setAttribute(attrName, strValue);
            }
            if (inArray(attrName, BOOLEAN_SYNCED_ATTRS)) {
              element[attrName] = Boolean(value);
            }
            if (inArray(attrName, STRING_SYNCED_ATTRS)) {
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
                value += this.eval(
                  expressions[part.markerID].node.value,
                  data,
                ) ?? '';
              }
            }
            element.setAttribute(attrName, value);
          }));
        }
      }
    }

    // Pass 2: Find and bind comment markers for text positions
    const commentWalker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    const commentsToReplace = [];
    let comment;
    while ((comment = commentWalker.nextNode())) {
      if (comment.data.startsWith(COMMENT_MARKER)) {
        const markerID = parseInt(comment.data.slice(COMMENT_MARKER.length));
        if (!isNaN(markerID) && !processedAttrIDs.has(markerID)) {
          commentsToReplace.push({ comment, markerID });
        }
      }
    }

    for (const { comment, markerID } of commentsToReplace) {
      const { node: exprNode } = expressions[markerID];
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
  }

  /*******************************
        Helpers
  *******************************/

  getLastNode(fragment) {
    for (let i = fragment.childNodes.length - 1; i >= 0; i--) {
      return fragment.childNodes[i];
    }
    return null;
  }

  /*******************************
        Conditional Rendering
  *******************************/

  createConditional({ node, data, scope, fragment, lastNode }) {
    const region = new DynamicRegion(fragment, lastNode);
    region.placeAnchor();

    let currentBranchIndex = -1;

    scope.track(Reaction.create((comp) => {
      const anchor = region.anchor || region.getLastNode();
      if (!comp.firstRun && anchor && !anchor.isConnected) {
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

  createEach({ node, data, scope, fragment, lastNode }) {
    const region = new DynamicRegion(fragment, lastNode);
    region.placeAnchor();

    const itemMap = new Map();
    let currentKeys = [];
    let showingElse = false;

    scope.track(Reaction.create((comp) => {
      const anchor = region.anchor || region.getLastNode();
      if (!comp.firstRun && anchor && !anchor.isConnected) {
        comp.stop();
        return;
      }

      const rawItems = this.eval(node.over, data) || [];
      const collectionType = this.getCollectionType(rawItems);
      const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

      // Handle empty → else
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

      // Remove items no longer present
      for (const key of currentKeys) {
        if (!newKeys.includes(key)) {
          const entry = itemMap.get(key);
          entry.scope.dispose();
          for (const n of entry.nodes) { n.remove(); }
          itemMap.delete(key);
        }
      }

      // Build/update items
      let insertAfter = region.anchor || lastNode;

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
        if (typeof prop === 'symbol') { return target[prop]; }
        const itemData = itemSignal.value;
        if (prop in itemData) { return itemData[prop]; }
        return target[prop];
      },
      has(target, prop) {
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

  createAsync({ node, data, scope, fragment, lastNode }) {
    const region = new DynamicRegion(fragment, lastNode);
    region.placeAnchor();
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
      const anchor = region.anchor || region.getLastNode();
      if (!comp.firstRun && anchor && !anchor.isConnected) {
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

  createRerender({ node, data, scope, fragment, lastNode }) {
    const region = new DynamicRegion(fragment, lastNode);
    region.placeAnchor();

    // Initial render
    const initialScope = scope.child();
    const initialFragment = this.readAST({ ast: node.content, data, scope: initialScope });
    region.setContent(initialFragment, initialScope);

    scope.track(Reaction.create((comp) => {
      const anchor = region.getLastNode();
      if (!comp.firstRun && anchor && !anchor.isConnected) {
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

  createSubtemplate({ node, data, scope, fragment, lastNode }) {
    const region = new DynamicRegion(fragment, lastNode);
    region.placeAnchor();

    let currentTemplateID = null;
    let currentInstance = null;

    scope.track(Reaction.create((comp) => {
      const anchor = region.anchor || region.getLastNode();
      if (!comp.firstRun && anchor && !anchor.isConnected) {
        comp.stop();
        return;
      }

      // Track parent dataVersion so this Reaction re-fires when
      // the parent's data context is updated via setData/bumpDataVersion
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
        currentInstance.initialize();
        const templateFragment = currentInstance.render();
        region.setContent(templateFragment);

        const renderRoot = this.template?.element?.renderRoot;
        if (renderRoot) {
          currentInstance.setElement(this.template.element);
          currentInstance.attach(renderRoot, {
            parentNode: region.parentNode,
          });
        }
        if (this.template) { currentInstance.setParent(this.template); }
      }
      else {
        // Same template — update data context, Reactions handle DOM updates.
        // rerender: false keeps rendered=true so Template.render() bumps
        // dataVersion instead of re-creating DOM from scratch.
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

  createSnippet({ node, data, scope, fragment, lastNode, templateName }) {
    const snippet = this.snippets[templateName];
    if (!snippet) {
      fatal(`Snippet "${templateName}" not found`);
    }

    // Snippets inherit parent data and overlay passed props via a Proxy.
    // Overlay props are stored as lazy getters so they re-evaluate reactively.
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

    // Create a proxy that layers snippet props over parent data
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
    fragment.append(snippetFragment);
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
          templateData[key] = Reaction.nonreactive(() => this.evaluator.lookupExpressionValue(expr, data));
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
