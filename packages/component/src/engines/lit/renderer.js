import { html } from 'lit';

import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';
import { each, mapObject, wrapFunction, hashCode, fatal, isFunction } from '@semantic-ui/utils';

import { reactiveData } from './directives/reactive-data.js';
import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveEach } from './directives/reactive-each.js';
import { renderTemplate } from './directives/render-template.js';

export class LitRenderer {

  static html = html;

  static STRING_REGEXP = /^\'(.*)\'$/;
  static OUTER_PARENS_REGEXP = /^\((.+)\)$/;
  static EXPRESSION_REGEXP = /('[^']*'|[^\s]+)/g;

  static getID = ({ast}) => {
    return hashCode(JSON.stringify({ast}));
  };

  constructor({ ast, data, subTemplates, helpers }) {
    this.ast = ast || '';
    this.id = LitRenderer.getID({ast, data});
    this.data = data;
    this.renderTrees = {};
    this.subTemplates = subTemplates;
    this.resetHTML();
    this.helpers = helpers || {};
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
    this.id = LitRenderer.getID({ast});
    this.data = data;
    this.resetHTML();
    this.readAST({ ast });
    this.clearTemp();
    this.litTemplate = html.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }

  cachedRender() {
    return this.litTemplate;
  }

  readAST({ ast = this.ast } = {}) {
    each(ast, (node) => {
      switch (node.type) {
        case 'html':
          this.addHTML(node.html);
          break;

        case 'expression':
          const value = this.evaluateExpression(node.value, {
            unsafeHTML: node.unsafeHTML,
            ifDefined: node.ifDefined,
            asDirective: true,
          });
          this.addValue(value);
          break;

        case 'if':
          this.addValue(this.evaluateConditional(node));
          break;

        case 'each':
          this.addValue(this.evaluateEach(node));
          break;

        case 'template':
          this.addValue(this.evaluateTemplate(node));
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
  evaluateConditional(node) {
    const directiveMap = (value, key) => {
      if (key == 'branches') {
        return value.map((branch) => mapObject(branch, directiveMap));
      }
      if (key == 'condition') {
        return () => this.evaluateExpression(value);
      }
      if (key == 'content') {
        return () => this.renderSubtree({ ast: value, data: this.data });
      }
      return value;
    };
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }

  evaluateEach(node) {
    const directiveMap = (value, key) => {
      if (key == 'over') {
        return (expressionString) => {
          const computedValue = this.evaluateExpression(value);
          return computedValue;
        };
      }
      if (key == 'content') {
        return (eachData) => {
          return this.renderSubtree({
            // we currently dont have an adequate solution for not rerendering
            //  identical subtrees with different data contexts
            allowCache: false,
            ast: value,
            data: { ...this.data, ...eachData },
          });
        };
      }
      return value;
    };
    let eachArguments = mapObject(node, directiveMap);
    return reactiveEach(eachArguments, this.data);
  }

  evaluateTemplate(node) {
    const getValue = (expressionString) => {
      const value = this.evaluateExpression(expressionString);
      return value;
    };

    // template names can be dynamic
    const getTemplateName = () => getValue(node.name);

    // data can either be reactive or nonreactive
    const staticValues = mapObject(node.data || {}, (value) => {
      return () => Reaction.nonreactive(() => getValue(value));
    });
    const reactiveValues = mapObject(node.reactiveData || {}, (value) => {
      return () => getValue(value);
    });
    const templateData = {
      ...staticValues,
      ...reactiveValues,
    };
    return renderTemplate({
      subTemplates: this.subTemplates,
      getTemplateName: getTemplateName,
      data: templateData,
      parentTemplate: this.data,
    });
  }

  // i.e foo.baz = { foo: { baz: 'value' } }
  evaluateExpression(expression, { asDirective = false, ifDefined = false, unsafeHTML = false } = {}) {
    if (typeof expression === 'string') {
      if (asDirective) {
        return reactiveData(() => {
          const result = this.lookupExpressionValue(expression);
          return result;
        }, { ifDefined, unsafeHTML });
      }
      else {
        return this.lookupExpressionValue(expression);
      }
    }
    return expression;
  }

  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  // i.e. {{format sayWord 'balloon' 'dog'}} => format(sayWord('balloon', 'dog'))
  lookupExpressionValue(expressionString = '', { unsafeHTML = false } = {}) {

    const data = this.data;

    // if the whole expression is a string we want to return that
    const stringRegExp = LitRenderer.STRING_REGEXP;
    const stringMatches = expressionString.match(stringRegExp);
    if (stringMatches && stringMatches.length > 0) {
      return stringMatches[1];
    }


    // converts "foo baz 'wiz bang'" => ["foo", "baz", "'wiz bang'"]
    const splitExpressionString = (str) => {
      const regex = LitRenderer.EXPRESSION_REGEXP;
      const matches = str.match(regex);
      return matches || [];
    };

    // we can safely remove outer parens
    expressionString = expressionString.replace(LitRenderer.OUTER_PARENS_REGEXP, '$1');

    const expressions = splitExpressionString(expressionString).reverse();
    let funcArguments = [];
    let result;
    each(expressions, (expression, index) => {

      // This lookups a deep value in an object, calling any intermediary functions
      const getDeepValue = (obj, path) =>
        path.split('.').reduce((acc, part) => {
          if (acc === undefined) {
            return undefined;
          }
          const current = wrapFunction(acc)();
          if (current == undefined) {
            fatal(`Error evaluating expression "${expressionString}"`);
          }
          return current[part];
        }, obj);

      // the 'this' context' is the path up to expression
      // i.e. 'deep.path.reactive.get()' -> 'deep.path.reactive'
      const getContext = () => {
        const path = expression.split('.').slice(0, -1).join('.');
        const context = getDeepValue(data, path);
        return context;
      };

      let dataValue = getDeepValue(data, expression);
      const helper = this.helpers[expression];
      // check if we have a global helper with this name
      if (!dataValue && isFunction(helper)) {
        dataValue = helper;
      }

      let stringMatches;
      if (isFunction(dataValue)) {
        // Binding the function to a dynamic context and invoking it with accumulated arguments RTL
        const boundFunc = dataValue.bind(getContext());
        result = boundFunc(...funcArguments);
      }
      else if (dataValue !== undefined) {
        result = (dataValue instanceof ReactiveVar)
          ? dataValue.value
          : dataValue;
      }
      else if (
        (stringMatches = stringRegExp.exec(expression)) !== null &&
        stringMatches.length > 1
      ) {
        result = stringMatches[1];
      }
      else if (!Number.isNaN(parseFloat(expression))) {
        // Numbers should be passed as their numerical values to functions
        result = Number(expression);
      }
      else {
        result = undefined;
      }
      funcArguments.unshift(result);
    });
    return result;
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

  // each subtree is rendered as a separate context recursively
  createSubtree({ ast, data, subTemplates }) {
    const tree = new LitRenderer({
      ast,
      data: data,
      subTemplates: this.subTemplates,
      helpers: this.helpers,
    });
    this.renderTrees[tree.id] = tree;
    return tree;
  }

  // we only need to call 'render' the first time we create a subtree
  // subsequent runs can just modify the data context using tree.updateData(data)
  renderSubtree({ ast, data, subTemplates, returnTree = false, allowCache = true }) {
    const treeID = LitRenderer.getID({ast});
    let tree = this.renderTrees[treeID];
    let cached = false;
    if(allowCache && tree) {
      // no need to rerender if we have existing subtree and same data
      tree.setData(data);
      cached = true;
    }
    else {
      // otherwise parse ast and create subtree
      tree = this.createSubtree({ast, data, subTemplates});
    }
    if(returnTree) {
      return tree;
    }
    if(cached) {
      return tree.cachedRender();
    }
    else {
      return tree.render();
    }
  }

  setData(data) {
    this.updateData(data);
    each(this.renderTrees, (tree) => {
      tree.setData(data);
    });
  }

  // avoid clobbering other values
  updateData(data) {
    each(data, (value, key) => {
      this.data[key] = value;
    });
  }

  clearTemp() {
    delete this.lastHTML; // used to concat concurrent html
  }
}
