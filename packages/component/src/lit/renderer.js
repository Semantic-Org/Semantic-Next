import { html } from 'lit';

import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';
import { each, mapObject, wrapFunction, fatal, isFunction } from '@semantic-ui/utils';

import { reactiveData } from './directives/reactive-data.js';
import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveEach } from './directives/reactive-each.js';
import { renderTemplate } from './directives/render-template.js';

import { Helpers } from './helpers';

export class LitRenderer {
  static helpers = Helpers;

  static html = html;

  static addHelper(name, helper) {
    LitRenderer.helpers[name] = helper;
  }

  constructor({ ast, data, subTemplates }) {
    this.ast = ast || '';
    this.data = data;
    this.subTemplates = subTemplates;
    this.resetHTML();
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
    this.litTemplate = html.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }

  readAST({ ast = this.ast, data = this.data } = {}) {
    each(ast, (node) => {
      switch (node.type) {
        case 'html':
          this.addHTML(node.html);
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

        case 'template':
          this.addValue(this.evaluateTemplate(node, data));
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
        return value.map((branch) => mapObject(branch, directiveMap));
      }
      if (key == 'condition') {
        return () => this.evaluateExpression(value, data);
      }
      if (key == 'content') {
        return () => this.renderContent({ ast: value, data });
      }
      return value;
    };
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }

  evaluateEach(node, data) {
    const directiveMap = (value, key) => {
      if (key == 'over') {
        return (expressionString) => {
          const computedValue = this.evaluateExpression(value, data);
          return computedValue;
        };
      }
      if (key == 'content') {
        return (eachData) => {
          return this.renderContent({
            ast: value,
            data: { ...data, ...eachData },
          });
        };
      }
      return value;
    };
    let eachArguments = mapObject(node, directiveMap);
    return reactiveEach(eachArguments, data);
  }

  evaluateTemplate(node, data = {}) {
    const getValue = (expressionString) => {
      const value = this.evaluateExpression(expressionString, data);
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
      parentTemplate: data,
    });
  }

  // i.e foo.baz = { foo: { baz: 'value' } }
  evaluateExpression(
    expression,
    data = this.data,
    { asDirective = false, ifDefined = false, unsafeHTML = false } = {}
  ) {
    if (typeof expression === 'string') {
      if (asDirective) {
        return reactiveData(
          () => this.lookupExpressionValue(expression, data),
          { ifDefined, unsafeHTML }
        );
      }
      else {
        return this.lookupExpressionValue(expression, data);
      }
    }
    return expression;
  }

  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  // i.e. {{format sayWord 'balloon' 'dog'}} => format(sayWord('balloon', 'dog'))
  lookupExpressionValue(
    expressionString = '',
    data = {},
    { unsafeHTML = false } = {}
  ) {
    // if the whole expression is a string we want to return that
    const stringRegExp = /^\'(.*)\'$/;
    const stringMatches = expressionString.match(stringRegExp);
    if (stringMatches && stringMatches.length > 0) {
      return stringMatches[1];
    }

    const expressions = expressionString.split(' ').reverse();
    let funcArguments = [];
    let result;
    each(expressions, (expression, index) => {
      // This lookups a deep value in an object, calling any intermediary functions
      const getDeepValue = (obj, path) =>
        path.split('.').reduce((acc, part) => {
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
      const helper = LitRenderer.helpers[expression];
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

  // subtrees are rendered as separate contexts
  renderContent({ ast, data, subTemplates }) {
    return new LitRenderer({
      ast,
      data,
      subTemplates: this.subTemplates,
    }).render();
  }

  clearTemp() {
    delete this.lastHTML; // used to concat concurrent html
  }
}
