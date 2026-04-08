import { html, svg } from 'lit';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import {
  assignInPlace,
  each,
  fatal,
  filterObject,
  hashCode,
  inArray,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  keys,
  mapObject,
  noop,
  wrapFunction,
} from '@semantic-ui/utils';

import { ExpressionEvaluator } from '../../expression-evaluator.js';

import { reactiveAsync } from './directives/reactive-async.js';
import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveData } from './directives/reactive-data.js';
import { reactiveEach } from './directives/reactive-each.js';
import { reactiveRerender } from './directives/reactive-rerender.js';
import { renderTemplate } from './directives/render-template.js';

export class LitRenderer {
  static html = html;

  static useSubtreeCache = true;

  static getID({ ast, key, position, isSVG } = {}) {
    if (key !== undefined) {
      return hashCode({ ast, key });
    }
    if (position !== undefined) {
      return hashCode({ ast, position });
    }
    return hashCode({ ast });
  }

  constructor(
    { ast, data, template, subTemplates, snippets, helpers, isSVG = false, inheritsData = true, protectedKeys } = {},
  ) {
    this.ast = ast || '';
    this.data = data;
    this.renderTrees = {}; // stores templates but garbage collectable
    this.treeIDs = []; // stored content ids
    this.template = template;
    this.subTemplates = subTemplates;
    this.resetHTML();
    this.snippets = snippets || {};
    this.helpers = helpers || {};
    this.isSVG = isSVG;
    this.inheritsData = inheritsData; // for subtrees lets us know if this needs to have data updates downstream
    this.protectedKeys = protectedKeys; // keys scoped to this subtree (loop vars, async results) that parent updates cannot overwrite
    this.id = LitRenderer.getID({ ast, data, isSVG });
    this.dataVersion = new Signal(0, { allowClone: false, isEqual: noop });

    // Delegate expression evaluation
    this.evaluator = new ExpressionEvaluator({
      data: this.data,
      helpers: this.helpers,
      dataVersion: this.dataVersion,
    });
  }

  resetHTML() {
    this.html = [];
    this.html.raw = [];
    this.expressions = [];
  }

  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  render({ ast = this.ast, data = this.data } = {}) {
    this.resetHTML();
    this.readAST({ ast, data });
    this.clearTemp();
    const renderer = (this.isSVG) ? svg : html;
    this.litTemplate = renderer.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }

  cachedRender(data) {
    if (data) {
      this.updateData(data);
      this.bumpDataVersion();
    }
    return this.litTemplate;
  }

  bumpDataVersion() {
    this.dataVersion.increment();
    each(this.renderTrees, (ref) => {
      const tree = ref.deref();
      if (tree?.inheritsData) {
        tree.updateData(this.data, { respectProtectedKeys: true });
        tree.bumpDataVersion();
      }
    });
  }

  readAST({ ast = this.ast, data = this.data } = {}) {
    each(ast, (node) => {
      switch (node.type) {
        case 'html':
          this.addHTML(node.html);
          break;

        case 'svg':
          this.addValue(this.evaluateSVG(node.content, data));
          break;

        case 'expression':
          const value = this.evaluateExpression(node.value, data, {
            unsafeHTML: node.unsafeHTML,
            ifDefined: node.ifDefined,
            asDirective: true,
          });
          this.addValue(value);
          break;

        case 'if':
          this.addValue(this.evaluateConditional(node, data));
          break;

        case 'each':
          this.addValue(this.evaluateEach(node, data));
          break;

        case 'async':
          this.addValue(this.evaluateAsync(node, data));
          break;

        case 'rerender':
          this.addValue(this.evaluateRerender(node, data));
          break;

        case 'template':
          this.addValue(this.evaluateTemplate(node, data));
          break;

        case 'snippet':
          this.snippets[node.name] = node;
          break;

        case 'slot':
          if (node.name) {
            this.addHTML(`<slot name="${node.name}"></slot>`);
          }
          else {
            this.addHTML(`<slot></slot>`);
          }
          break;
      }
    });
  }

  /*
    The conditional directive takes an if condition and branches
    but does not have access to LitRenderer and evaluateExpression
    so we have to pass through functions that do this
  */
  evaluateConditional(node, data) {
    const directiveMap = (value, key) => {
      if (key == 'branches') {
        return value.map((branch) => {
          if (branch.condition) {
            branch.expression = branch.condition;
          }
          return mapObject(branch, directiveMap);
        });
      }
      if (key == 'condition') {
        return () => this.evaluateExpression(value, data);
      }
      if (key == 'content') {
        return () => this.renderContent({ ast: value, data });
      }
      return value;
    };
    node.expression = node.condition; // store original expression for debugging
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }

  /*
    The rerender directive rerenders a block of content everytime
    a reactive context value is changed
  */
  evaluateRerender(node, data) {
    const directiveMap = (value, key) => {
      if (key == 'expression') {
        return () => this.evaluator.lookupTokenValue(value, data);
      }
      if (key == 'key') {
        return () => this.evaluator.lookupTokenValue(value, data);
      }
      if (key == 'content') {
        return () => this.renderContent({ ast: value, data });
      }
      return value;
    };

    // Store original expressions for debugging
    node.expressionString = node.expression;
    node.keyString = node.key;

    let rerenderArguments = mapObject(node, directiveMap);
    return reactiveRerender(rerenderArguments);
  }

  /*
    The async directive takes an async expression and content blocks.
    It needs to return reactive values from renderer.
  */
  evaluateAsync(node, data) {
    const directiveMap = (value, key) => {
      if (key == 'expression') {
        return () => this.evaluateExpression(value, data);
      }
      if (key == 'content') {
        return (asyncData) => {
          // async data is the resolved value context
          data = { ...this.data, ...asyncData };
          return this.renderContent({
            ast: value,
            data,
            protectedKeys: keys(asyncData),
          });
        };
      }
      if (key == 'loadingContent') {
        if (!value.length) { return null; }
        return () => {
          return this.renderContent({
            ast: value,
            data: this.data,
          });
        };
      }
      if (key == 'errorContent') {
        if (!value.length) { return null; }
        return (errorData) => {
          // error data contains the error context
          data = { ...this.data, ...errorData };
          return this.renderContent({
            ast: value,
            data,
            protectedKeys: keys(errorData),
          });
        };
      }
      return value;
    };
    let asyncArguments = mapObject(node, directiveMap);
    return reactiveAsync(asyncArguments);
  }

  /*
    The conditional directive takes an each conditions
    with over() and content(). it needs to
    return reactive values from renderer
  */
  evaluateEach(node, data) {
    const directiveMap = (value, key) => {
      if (key == 'over') {
        return (expressionString) => {
          const computedValue = this.evaluateExpression(value, data);
          return computedValue;
        };
      }
      if (key == 'content') {
        return (eachData, eachKey) => {
          // each data is (index, this, as) from curent position
          data = { ...this.data, ...eachData };
          return this.renderContent({
            ast: value,
            data,
            key: eachKey,
            protectedKeys: keys(eachData),
          });
        };
      }
      if (key == 'elseContent') {
        return (data) => {
          return this.renderContent({
            ast: value,
            data: this.data,
          });
        };
      }
      return value;
    };
    let eachArguments = mapObject(node, directiveMap);
    return reactiveEach(eachArguments, data);
  }

  evaluateTemplate(node, data = {}) {
    const templateName = this.evaluator.lookupExpressionValue(node.name, data);
    if (this.snippets[templateName]) {
      return this.evaluateSnippet(node, data);
    }
    else {
      return this.evaluateSubTemplate(node, data);
    }
  }

  evaluateSVG(svg, data) {
    return this.renderContent({
      isSVG: true,
      ast: svg,
      data,
    });
  }

  // returns a function that returns the value in the current data context
  getPackedValue = (expression, data, { reactive = false } = {}) => {
    const getValue = (expressionString) => {
      const value = this.evaluateExpression(expressionString, data);
      return value;
    };
    return (reactive)
      ? () => getValue(expression)
      : () => Reaction.nonreactive(() => getValue(expression));
  };

  getPackedNodeData(node, data, { inheritsData = false } = {}) {
    const getPackedData = (unpackedData, options = {}) => {
      let packedData = {};
      // this is a data expression like {> someTemplate data=getData }
      // returns a callable that re-evaluates the expression on each unpack
      if (isString(unpackedData)) {
        const expression = unpackedData;
        packedData = () => this.evaluateExpression(expression, data, options);
      }
      else if (isPlainObject(unpackedData)) {
        // this is a data object like {> someTemplate data={one: someExpr, two: someExpr } }
        packedData = mapObject(unpackedData, (expression) => this.getPackedValue(expression, data, options));
      }
      return packedData;
    };
    const packedStaticData = getPackedData(node.data);
    const packedReactiveData = getPackedData(node.reactiveData, { reactive: true });

    // data expression returns a callable — use it as the entire packed context
    if (isFunction(packedStaticData) || isFunction(packedReactiveData)) {
      return isFunction(packedReactiveData) ? packedReactiveData : packedStaticData;
    }

    // only inherit parent data context if specified
    data = {
      ...(inheritsData) ? data : {},
      ...packedStaticData,
      ...packedReactiveData,
    };
    return data;
  }

  evaluateSnippet(node, data = {}) {
    const snippetName = this.evaluator.lookupExpressionValue(node.name, data);
    const snippet = this.snippets[snippetName];

    // snippets default to inheriting parent data
    const inheritsData = true;

    if (!snippet) {
      fatal(`Snippet "${snippetName}" not found`);
    }
    const snippetData = this.getPackedNodeData(node, data, { inheritsData });
    return this.renderContent({
      inheritsData,
      ast: snippet.content,
      data: snippetData,
      position: node.position,
    });
  }

  evaluateSubTemplate(node, data = {}) {
    const templateData = this.getPackedNodeData(node, data);
    return renderTemplate({
      subTemplates: this.subTemplates,
      templateName: node.name,
      getTemplate: () => this.evaluateExpression(node.name, data), // template can be dynamic
      data: templateData,
      parentTemplate: this.template,
    });
  }

  evaluateExpression(
    expression,
    data = this.data,
    { asDirective = false, ifDefined = false, unsafeHTML = false } = {},
  ) {
    if (typeof expression === 'string') {
      if (asDirective) {
        const dataArguments = {
          expression,
          literalValue: () => {
            this.dataVersion.get();
            return this.evaluator.lookupTokenValue(expression, this.data);
          },
          value: () => {
            this.dataVersion.get();
            return this.evaluator.lookupExpressionValue(expression, this.data);
          },
        };
        return reactiveData(dataArguments, { ifDefined, unsafeHTML });
      }
      else {
        this.dataVersion.get();
        return this.evaluator.lookupExpressionValue(expression, this.data);
      }
    }
    return expression;
  }

  addHTML(html) {
    // we want to concat all html added consecutively
    if (this.lastHTML) {
      const lastHTML = this.html.pop();
      html = `${lastHTML}${html}`;
    }
    this.html.push(html);
    this.html.raw.push(String.raw({ raw: html }));
    this.lastHTML = true;
  }

  addHTMLSpacer() {
    this.addHTML('');
  }

  addValue(expression) {
    this.addHTMLSpacer(); // spacer is necessary foo`{'one'}` evaluates to foo(['',''] ['one']) with tagged template literals
    this.expressions.push(expression);
    this.lastHTML = false;
    this.addHTMLSpacer();
  }

  // subtrees are rendered as separate contexts stored as weakrefs for gc
  renderContent({ ast, data, key, position, cache = true, isSVG = this.isSVG, protectedKeys } = {}) {
    if (cache && LitRenderer.useSubtreeCache) {
      const contentID = LitRenderer.getID({ ast, key, position, isSVG });
      const treeRef = this.renderTrees[contentID];
      const existingTree = treeRef ? treeRef.deref() : undefined;

      if (existingTree) {
        return existingTree.cachedRender(data);
      }

      const tree = new LitRenderer({
        ast,
        data,
        isSVG,
        protectedKeys,
        subTemplates: this.subTemplates,
        snippets: this.snippets,
        helpers: this.helpers,
        template: this.template,
      });
      this.treeIDs.push(contentID);
      this.renderTrees[contentID] = new WeakRef(tree);
      return tree.render();
    }

    const tree = new LitRenderer({
      ast,
      data,
      isSVG,
      protectedKeys,
      subTemplates: this.subTemplates,
      snippets: this.snippets,
      helpers: this.helpers,
      template: this.template,
    });
    return tree.render();
  }
  cleanup() {
    this.renderTrees = {};
  }

  setData(newData) {
    // current subtree can remove existing data if not present in new data
    this.updateData(newData, { preserveExistingData: false });

    // subtrees might have their own additive data. we dont want to remove this
    this.updateSubtreeData(newData, { preserveExistingData: true });

    // keep evaluator in sync
    this.evaluator.setData(this.data);
  }

  updateSubtreeData(newData) {
    each(this.renderTrees, (ref, contentID) => {
      // use deref to allow mem cleanup of subtrees
      const tree = ref.deref();
      if (tree?.inheritsData) {
        tree.updateData(newData, { respectProtectedKeys: true });
      }
    });
  }

  /*
    Note this is important to preserve the object reference vs clobbering
    const a = { foo: 'baz' }; const b = a.foo; a.foo = 'bar';
  */
  updateData(newData, { preserveExistingData = true, respectProtectedKeys = false } = {}) {
    // filter out keys scoped to this subtree (each loop vars, async results, snippet props)
    // only during parent propagation, not direct content updates
    if (respectProtectedKeys && this.protectedKeys) {
      newData = filterObject(newData, (value, key) => !inArray(key, this.protectedKeys));
    }
    assignInPlace(this.data, newData, { preserveExistingKeys: preserveExistingData });
  }

  clearTemp() {
    delete this.lastHTML; // used to concat concurrent html
  }
}
