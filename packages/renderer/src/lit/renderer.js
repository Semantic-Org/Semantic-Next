import { html, svg } from 'lit';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { each, mapObject, hashCode, wrapFunction, fatal, isArray, filterObject, isPlainObject, isString, isFunction } from '@semantic-ui/utils';

import { reactiveData } from './directives/reactive-data.js';
import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveEach } from './directives/reactive-each.js';
import { renderTemplate } from './directives/render-template.js';

export class LitRenderer {

  static html = html;

  static PARENS_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
  static STRING_REGEXP = /^\'(.*)\'$/;
  static WRAPPED_EXPRESSION = /(\s|^)([\[{].*?[\]}])(\s|$)/g;
  static VAR_NAME_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;

  static useSubtreeCache = false; // experimental

  static getID({ ast, data, isSVG } = {}) {
    return hashCode({ ast });
  }

  constructor({ ast, data, template, subTemplates, snippets, helpers, isSVG }) {
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
    this.id = LitRenderer.getID({ ast, data, isSVG });
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
    if(data) {
      this.updateData(data);
    }
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
  evaluateConditional(node, data) {
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
        return () => this.evaluateExpression(value, data);
      }
      if(key == 'content') {
        return () => this.renderContent({ ast: value, data });
      }
      return value;
    };
    node.expression = node.condition; // store original expression for debugging
    let conditionalArguments = mapObject(node, directiveMap);
    return reactiveConditional(conditionalArguments);
  }

  /*
    The conditional directive takes an each conditions
    with over() and content(). it needs to
    return reactive values from renderer
  */
  evaluateEach(node, data) {
    const directiveMap = (value, key) => {
      if(key == 'over') {
        return (expressionString) => {
          const computedValue = this.evaluateExpression(value, data);
          return computedValue;
        };
      }
      if(key == 'content') {
        return (eachData) => {
          // each data is (index, this, as) from curent position
          data = { ...this.data, ...eachData };
          return this.renderContent({
            ast: value,
            data,
          });
        };
      }
      if(key == 'else') {
        return (data) => {
          return this.renderContent({
            ast: value.content,
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
    const templateName = this.lookupExpressionValue(node.name, data);
    if(this.snippets[templateName]) {
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
      data
    });
  }

  // returns a function that returns the value in the current data context
  getPackedValue = (expression, data, { reactive = false } = {}) => {
    const getValue = (expressionString) => {
      const value = this.evaluateExpression(expressionString, data); // easier for breakpoints
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
        // note this is currently not reactive on the 'getData' expression
        // so it will be locked in when evaluated
        const expression = unpackedData; // this is an expression like data=getData
        unpackedData = this.evaluateExpression(expression, data, options);
        packedData = mapObject(unpackedData, wrapFunction);

      }
      else if(isPlainObject(unpackedData)) {
        // this is a data object like {> someTemplate data={one: someExpr, two: someExpr } }
        packedData = mapObject(unpackedData, (expression) => this.getPackedValue(expression, data, options));
      }
      return packedData;
    };
    const packedStaticData = getPackedData(node.data);
    const packedReactiveData = getPackedData(node.reactiveData, { reactive: true });

    // only inherit parent data context if specified
    data = {
      ...(inheritParent) ? this.data : {},
      ...packedStaticData,
      ...packedReactiveData
    };
    return data;
  }

  evaluateSnippet(node, data = {}) {
    const snippetName = this.lookupExpressionValue(node.name, data);
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
      getTemplate: () => this.evaluateExpression(node.name, data), // template can be dynamic
      data: templateData,
      parentTemplate: this.template,
    });
  }

  // i.e foo.baz = { foo: { baz: 'value' } }
  evaluateExpression(
    expression,
    data = this.data,
    { asDirective = false, ifDefined = false, unsafeHTML = false } = {}
  ) {
    if(typeof expression === 'string') {
      if(asDirective) {
        const dataArguments = {
          expression,
          value: () => this.lookupExpressionValue(expression, this.data)
        };
        return reactiveData(dataArguments, { ifDefined, unsafeHTML });
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

  // evaluate javascript expressions
  evaluateJavascript(code, context = {}, { includeHelpers = true } = {}) {
    let result;
    if(includeHelpers) {
      context = {
        ...this.helpers,
        ...context,
      };
      // only allow valid javascript variable names
      context = filterObject(context, (value, name) => {
        const reservedWords = ['debugger'];
        return !reservedWords.includes(name) && LitRenderer.VAR_NAME_REGEXP.test(name);
      });
    }

    try {
      const keys = Object.keys(context);
      let values = Object.values(context);
      // unbundle subtemplate/snippet data bundled in getPackedNodeData
      // functions with no parameters are safe to evaluate
      each(values, (value, index) => {
        /* Rollback change until fix reactivity issues
        if (value instanceof Signal) {
          Object.defineProperty(values, index, {
            get() {
              return value.get();
            },
            configurable: true,
            enumerable: true
          });
        }*/
        if (isFunction(value) && value.length === 0 && !value.name) {
          Object.defineProperty(values, index, {
            get() {
              return value();
            },
            configurable: true,
            enumerable: true
          });
        }
      });
      result = new Function(...keys, `return ${code}`)(...values);
    }
    catch (e) {
      // this token is not valid javascript 
    }
    return result;
  }

  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  lookupExpressionValue(expression = '', data = {}, visited = new Set()) {

    // detect recursion
    if (visited.has(expression)) {
      // throw new Error(`Cyclical expression detected: "${expression}"`);
      return undefined;
    }
    visited.add(expression);

    // short circuit - check if whole expression is available in data context
    // this will avoid overhead of evaluating as javascript
    const simpleExpression = !expression.includes(' ');
    if(simpleExpression) {
      const value = this.lookupTokenValue(expression, data);
      if(value !== undefined) {
        return wrapFunction(value)();
      }
    }

    // check if whole expression is JS before tokenizing
    const jsValue = this.evaluateJavascript(expression, data);
    if(jsValue !== undefined) {
      const value = this.accessTokenValue(jsValue, expression, data);
      visited.delete(expression);
      return wrapFunction(value)();
    }

    // wrap {} or [] in parens
    if(isString(expression)) {
      expression = this.addParensToExpression(expression);
    }

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
        result = this.lookupExpressionValue(token.join(' '), data, visited);
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
    visited.delete(expression);
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

    // retrieve token value from data context
    let dataValue = this.getDeepDataValue(data, token);
    let value = this.accessTokenValue(dataValue, token, data);
    if(value !== undefined) {
      return value;
    }

    // if undefined check if global helper
    const helper = this.helpers[token];
    if(isFunction(helper)) {
      return helper;
    }
  }

  getDeepDataValue(obj, path) {
    return path.split('.').reduce((acc, part) => {
      if(acc === undefined) {
        return undefined;
      }
      const current = (acc instanceof Signal)
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
  }

  // retrieve token value accessing getter for reactive vars
  accessTokenValue(tokenValue, token, data) {

    const getThisContext = (token, data) => {
      const path = token.split('.').slice(0, -1).join('.');
      return this.getDeepDataValue(data, path);
    };

    // bind context for functions with '.'
    if(isFunction(tokenValue) && token.search('.') !== -1) {
      const thisContext = getThisContext(token, data);
      tokenValue = tokenValue.bind(thisContext);
    }
    
    if(tokenValue !== undefined) {
      return (tokenValue instanceof Signal)
        ? tokenValue.value
        : tokenValue
      ;
    }
    return undefined;
  }

  addParensToExpression(expression = '') {
    // Match either an object {...} or array [...] at the start or after whitespace
    return String(expression).replace(LitRenderer.WRAPPED_EXPRESSION, (match, before, brackets, after) => {
      return `${before}(${brackets})${after}`;
    });
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

  // subtrees are rendered as separate contexts stored as weakrefs for gc
  renderContent({ ast, data, isSVG = this.isSVG } = {}) {
    const contentID = LitRenderer.getID({ast, data, isSVG});
    const treeRef = this.renderTrees[contentID];
    const existingTree = treeRef ? treeRef.deref() : undefined;
    // disabled for now
    if (LitRenderer.useSubtreeCache && existingTree) {
      return existingTree.cachedRender(data);
    }
    const tree = new LitRenderer({
      ast,
      data,
      isSVG,
      subTemplates: this.subTemplates,
      snippets: this.snippets,
      helpers: this.helpers,
      template: this.template,
    });
    this.treeIDs.push(contentID);
    this.renderTrees[contentID] = new WeakRef(tree);
    return tree.render();
  }
  cleanup() {
    this.renderTrees = [];
  }

  setData(newData) {
    this.updateData(newData);
    this.updateSubtreeData(newData);
  }

  // yeah we're going there, weakrefs
  updateSubtreeData(newData) {
    each(this.renderTrees, (ref, contentID) => {
      const tree = ref.deref();
      if(tree) {
        tree.updateData(newData);
      }
    });
  }

  /*
    Note this is important to preserve the object reference vs clobbering
    const a = { foo: 'baz' }; const b = a.foo; a.foo = 'bar';
  */
  updateData(newData) {
    each(this.data, (value, name) => {
      delete this.data[name];
    });
    each(newData, (value, name) => {
      if(this.data[name] !== value) {
        this.data[name] = value;
      }
    });
  }

  clearTemp() {
    delete this.lastHTML; // used to concat concurrent html
  }
}
