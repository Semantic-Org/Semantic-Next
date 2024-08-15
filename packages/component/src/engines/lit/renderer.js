import { html, svg } from 'lit';

import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';
import { each, mapObject, wrapFunction, fatal, isArray, isFunction } from '@semantic-ui/utils';

import { reactiveData } from './directives/reactive-data.js';
import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveEach } from './directives/reactive-each.js';
import { renderTemplate } from './directives/render-template.js';

export class LitRenderer {

  static html = html;

  static PARENS_REGEXP = /('[^']*'|\(|\)|[^\s()]+)/g;
  static STRING_REGEXP = /^\'(.*)\'$/;

  constructor({ ast, data, subTemplates, snippets, helpers, isSVG }) {
    this.ast = ast || '';
    this.data = data;
    this.renderTrees = [];
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
  render({ ast = this.ast, data = this.data } = {}) {
    this.resetHTML();
    this.readAST({ ast, data });
    this.clearTemp();
    const renderer = (this.isSVG) ? svg : html;
    this.litTemplate = renderer.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
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
    const templateName = this.lookupExpressionValue(node.name, data);
    if (this.snippets[templateName]) {
      return this.evaluateSnippet(node, data);
    }
    else {
      return this.evaluateSubTemplate(node, data);
    }
  }

  evaluateSVG(svg, data) {
    return this.renderContent({ ast: svg, isSVG: true, data });
  }

  evaluateSnippet(node, data = {}) {
    const getValue = (expressionString) => {
      return this.lookupExpressionValue(expressionString, data);
    };

    const snippetName = getValue(node.name);
    const snippet = this.snippets[snippetName];

    if (!snippet) {
      fatal(`Snippet "${snippetName}" not found`);
    }

    // Prepare snippet data
    const staticValues = mapObject(node.data || {}, (value) => {
      return Reaction.nonreactive(() => getValue(value));
    });
    const reactiveValues = mapObject(node.reactiveData || {}, (value) => {
      return getValue(value);
    });
    const snippetData = {
      ...data,
      ...staticValues,
      ...reactiveValues,
    };

    return this.renderContent({
      ast: snippet.content,
      data: snippetData,
    });
  }

  evaluateSubTemplate(node, data = {}) {
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
          () => this.lookupExpressionValue(expression, this.data),
          { ifDefined, unsafeHTML }
        );
      }
      else {
        return this.lookupExpressionValue(expression, data);
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
        if (token === '(') {
          result.push(parse(tokens));
        } else if (token === ')') {
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
  lookupExpressionValue(expression = '', data = {}) {
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

    if (isArray(token)) {
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
    if (isFunction(helper)) {
      return helper;
    }

    const getDeepValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => {
        if (acc === undefined) {
          return undefined;
        }
        const current = wrapFunction(acc)();
        if (current == undefined) {
          fatal(`Error evaluating expression "${path}"`);
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
    if (dataValue !== undefined) {
      return (dataValue instanceof ReactiveVar)
        ? dataValue.value
        : dataValue;
    }

    return undefined;
  }

  getLiteralValue(token) {

    // Check if this is a string literal (single or double quotes)
    if (token.length > 1 && (token[0] === "'" || token[0] === '"') && token[0] === token[token.length - 1]) {
      return token.slice(1, -1).replace(/\\(['"])/g, '$1');
    }

    // check if this is a boolean
    const boolString = { true: true, false: false };
    if(boolString[token] !== undefined) {
      return boolString[token];
    }

    // check if this is a number
    if (!Number.isNaN(parseFloat(token))) {
      return Number(token);
    }
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
  renderContent({ ast, data, isSVG = this.isSVG } = {}) {
    const tree = new LitRenderer({
      ast,
      data,
      isSVG,
      subTemplates: this.subTemplates,
      snippets: this.snippets,
      helpers: this.helpers,
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
