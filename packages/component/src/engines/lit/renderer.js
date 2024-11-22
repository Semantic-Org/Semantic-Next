import { html, svg } from 'lit';

import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';
import { each, mapObject, wrapFunction, fatal, isArray, isPlainObject, isString, isFunction } from '@semantic-ui/utils';

import { reactiveData } from './directives/reactive-data.js';
import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveEach } from './directives/reactive-each.js';
import { renderTemplate } from './directives/render-template.js';

export class LitRenderer {

  static html = html;

  static PARENS_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
  static STRING_REGEXP = /^\'(.*)\'$/;

  constructor({ ast, data, template, subTemplates, snippets, helpers, isSVG }) {
    this.ast = ast || '';
    this.data = data;
    this.renderTrees = [];
    this.template = template;
    this.subTemplates = subTemplates;
    this.resetHTML();
    this.snippets = snippets || {};
    this.helpers = helpers || {};
    this.isSVG = isSVG;
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
  render({ ast = this.ast, data } = {}) {
    this.resetHTML();
    if(data) {
      this.data = data;
    }
    this.readAST({ ast });
    this.clearTemp();
    const renderer = (this.isSVG) ? svg : html;
    this.litTemplate = renderer.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }

  readAST({ ast = this.ast } = {}) {
    each(ast, (node) => {
      switch (node.type) {
        case 'html':
          this.addHTML(node.html);
          break;

        case 'svg':
          this.addValue(this.evaluateSVG(node.content));
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

        case 'snippet':
          this.snippets[node.name] = node;
          break;

        case 'slot':
          if(node.name) {
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
      if(key == 'branches') {
        return value.map((branch) => {
          if(branch.condition) {
            branch.expression = branch.condition;
          }
          return mapObject(branch, directiveMap);
        });
      }
      if(key == 'condition') {
        return () => this.evaluateExpression(value);
      }
      if(key == 'content') {
        return () => this.renderContent({ ast: value });
      }
      return value;
    };
    node.expression = node.condition; // store original expression for debugging
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }

  evaluateEach(node) {
    const directiveMap = (value, key) => {
      if(key == 'over') {
        return (expressionString) => {
          const computedValue = this.evaluateExpression(value);
          return computedValue;
        };
      }
      if(key == 'content') {
        return (eachData) => {
          return this.renderContent({
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
    const templateName = this.lookupExpressionValue(node.name);
    if(this.snippets[templateName]) {
      return this.evaluateSnippet(node);
    }
    else {
      return this.evaluateSubTemplate(node);
    }
  }

  evaluateSVG(svg) {
    return this.renderContent({
      isSVG: true,
      ast: svg
    });
  }

  // returns a function that returns the value in the current data context
  getPackedValue = (expression, data, { reactive = false } = {}) => {
    const getValue = (expressionString) => {
      const value = this.evaluateExpression(expressionString); // easier for breakpoints
      return value;
    };
    return (reactive)
      ? () => getValue(expression)
      : () => Reaction.nonreactive(() => getValue(expression))
    ;
  };

  getPackedNodeData(node, data, { inheritParent = false } = {}) {

    const getPackedData = (unpackedData, options = {}) => {
      let packedData = {};
      // this is a data object like {> someTemplate data=getData }
      // we need to get the data first before we can wrap it
      if(isString(unpackedData)) {
        unpackedData = this.evaluateExpression(unpackedData, options);
      }
      // okay now we have the data in both cases, lets pack it
      // this is a data object like {> someTemplate data={one: someExpr, two: someExpr } }
      if(isPlainObject(unpackedData)) {
        packedData = mapObject(unpackedData, (expression) => this.getPackedValue(expression, data, options));
      }
      return packedData;
    };

    const packedStaticData = getPackedData(node.data);
    const packedReactiveData = getPackedData(node.reactiveData, { reactive: true });

    // only inherit parent data context if specified
    let parentData = (inheritParent)
      ? data
      : {}
    ;
    const packedData = {
      ...parentData,
      ...packedStaticData,
      ...packedReactiveData
    };
    return packedData;
  }

  evaluateSnippet(node, data = {}) {
    const snippetName = this.lookupExpressionValue(node.name);
    const snippet = this.snippets[snippetName];
    if(!snippet) {
      fatal(`Snippet "${snippetName}" not found`);
    }
    const snippetData = this.getPackedNodeData(node, data, { inheritParent: true });
    return this.renderContent({
      ast: snippet.content,
      data: snippetData,
    });
  }

  evaluateSubTemplate(node, data = {}) {
    const templateData = this.getPackedNodeData(node, data);
    return renderTemplate({
      subTemplates: this.subTemplates,
      templateName: node.name,
      getTemplate: () => this.evaluateExpression(node.name), // template can be dynamic
      data: templateData,
      parentTemplate: this.template,
    });
  }

  // i.e foo.baz = { foo: { baz: 'value' } }
  evaluateExpression(
    expression,
    { asDirective = false, ifDefined = false, unsafeHTML = false } = {}
  ) {
    if(typeof expression === 'string') {
      if(asDirective) {
        const dataArguments = {
          expression,
          value: () => this.lookupExpressionValue(expression)
        };
        return reactiveData(dataArguments, { ifDefined, unsafeHTML });
      }
      else {
        return this.lookupExpressionValue(expression);
      }
    }
    return expression;
  }

  // parses an expression like 'maybe (isEven number)' to ['maybe, ['isEven', 'number']]
  getExpressionArray(expr) {
    const tokens = expr.match(LitRenderer.PARENS_REGEXP) || [];
    const parse = (tokens) => {
      const result = [];
      while (tokens.length > 0) {
        const token = tokens.shift();
        if(token === '(') {
          result.push(parse(tokens));
        } else if(token === ')') {
          return result;
        } else {
          result.push(token);
        }
      }
      return result;
    };
    return parse(tokens);
  }

  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  lookupExpressionValue(expression = '', data = this.data) {
    const expressionArray = isArray(expression)
      ? expression
      : this.getExpressionArray(expression)
    ;

    let funcArguments = [];
    let result;

    let index = expressionArray.length;
    while(index--) {
      const token = expressionArray[index];
      if(isArray(token)) {
        result = this.lookupExpressionValue(token, data);
        funcArguments.unshift(result);
      }
      else {
        const tokenValue = this.lookupTokenValue(token, data);
        result = isFunction(tokenValue)
          ? tokenValue(...funcArguments)
          : tokenValue
        ;
        funcArguments.unshift(result);
      }
    }
    return result;
  }

  lookupTokenValue(token = '', data) {

    if(isArray(token)) {
      // Recursively evaluate nested expressions
      return this.lookupExpressionValue(token, data);
    }

    // check if this is a value not requiring lookup
    const literalValue = this.getLiteralValue(token);
    if(literalValue !== undefined) {
      return literalValue;
    }

    // check if this is a global helper
    const helper = this.helpers[token];
    if(isFunction(helper)) {
      return helper;
    }

    const getDeepValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => {
        if(acc === undefined) {
          return undefined;
        }
        const current = (acc instanceof ReactiveVar)
          ? acc.get()
          : wrapFunction(acc)()
        ;
        if(current == undefined) {
          return undefined;
          /* erroring on intermediate undefined
             feels better not as an error state
            but this may change
          */
          //fatal(`Error evaluating expression "${path}"`);
        }
        return current[part];
      }, obj);
    };


    const getThisContext = (token, data) => {
      const path = token.split('.').slice(0, -1).join('.');
      return getDeepValue(data, path);
    };

    // otherwise retrieve this value from the data context
    let dataValue = getDeepValue(data, token);

    // bind context for functions with '.'
    if(isFunction(dataValue) && token.search('.') !== -1) {
      const thisContext = getThisContext(token, data);
      dataValue = dataValue.bind(thisContext);
    }

    // retrieve reactive value
    if(dataValue !== undefined) {
      return (dataValue instanceof ReactiveVar)
        ? dataValue.value
        : dataValue;
    }

    return undefined;
  }

  getLiteralValue(token) {

    // Check if this is a string literal (single or double quotes)
    if(token.length > 1 && (token[0] === "'" || token[0] === '"') && token[0] === token[token.length - 1]) {
      return token.slice(1, -1).replace(/\\(['"])/g, '$1');
    }

    // check if this is a boolean
    const boolString = { true: true, false: false };
    if(boolString[token] !== undefined) {
      return boolString[token];
    }

    // check if this is a number
    if(!Number.isNaN(parseFloat(token))) {
      return Number(token);
    }
  }

  addHTML(html) {
    // we want to concat all html added consecutively
    if(this.lastHTML) {
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
  renderContent({ ast, data = this.data, isSVG = this.isSVG } = {}) {
    const tree = new LitRenderer({
      ast,
      data,
      isSVG,
      subTemplates: this.subTemplates,
      snippets: this.snippets,
      helpers: this.helpers,
      template: this.template,
    });
    this.renderTrees.push(tree);
    return tree.render();
  }

  setData(data) {
    this.data = data;
    each(this.renderTrees, (tree) => {
      tree.updateData(data);
    });
  }

  updateData(data) {
    each(data, (value, name) => {
      if(this.data[name] !== undefined && this.data[name] !== value) {
        this.data[name] = value;
      }
    });
  }

  clearTemp() {
    delete this.lastHTML; // used to concat concurrent html
  }
}
