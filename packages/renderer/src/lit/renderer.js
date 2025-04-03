import { html, svg } from 'lit';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import {
  each,
  fatal,
  filterObject,
  hashCode,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  mapObject,
  wrapFunction,
} from '@semantic-ui/utils';

import { reactiveConditional } from './directives/reactive-conditional.js';
import { reactiveData } from './directives/reactive-data.js';
import { reactiveEach } from './directives/reactive-each.js';
import { renderTemplate } from './directives/render-template.js';

export class LitRenderer {
  static html = html;

  static PARENS_REGEXP = /\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\)/g; // match `(one () )` and [`(one)`, `(two)`]
  static TOKEN_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g; // match "" '', \b for token groups in Lisp style expr
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
    if (data) {
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
        return (eachData) => {
          // each data is (index, this, as) from curent position
          data = { ...this.data, ...eachData };
          return this.renderContent({
            ast: value,
            data,
          });
        };
      }
      if (key == 'else') {
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
      const value = this.evaluateExpression(expressionString, data); // easier for breakpoints
      return value;
    };
    return (reactive)
      ? () => getValue(expression)
      : () => Reaction.nonreactive(() => getValue(expression));
  };

  getPackedNodeData(node, data, { inheritParent = false } = {}) {
    const getPackedData = (unpackedData, options = {}) => {
      let packedData = {};
      // this is a data object like {> someTemplate data=getData }
      // we need to get the data first before we can wrap it
      if (isString(unpackedData)) {
        // note this is currently not reactive on the 'getData' expression
        // so it will be locked in when evaluated
        const expression = unpackedData; // this is an expression like data=getData
        unpackedData = this.evaluateExpression(expression, data, options);
        packedData = mapObject(unpackedData, wrapFunction);
      }
      else if (isPlainObject(unpackedData)) {
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
      ...packedReactiveData,
    };
    return data;
  }

  evaluateSnippet(node, data = {}) {
    const snippetName = this.lookupExpressionValue(node.name, data);
    const snippet = this.snippets[snippetName];
    if (!snippet) {
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
    { asDirective = false, ifDefined = false, unsafeHTML = false } = {},
  ) {
    if (typeof expression === 'string') {
      if (asDirective) {
        const dataArguments = {
          expression,
          value: () => this.lookupExpressionValue(expression, this.data),
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
  // parse parensed expression like `outerFunc (innerJS ? trueCond : falseCond)` -> [outerFunc, jsExpr]
  getExpressionArray(expr) {
    // Storage for extracted parenthetical groups
    const groups = [];

    // Replace parenthetical groups with placeholders
    const processedExpr = expr.replace(LitRenderer.PARENS_REGEXP, match => {
      const placeholder = `__GROUP${groups.length}__`;
      groups.push(match.slice(1,-1)); // remove parens ()
      return placeholder;
    });

    // Split into groups based off Lisp style tokens preserving "" and '' groups
    const tokens = processedExpr.match(LitRenderer.TOKEN_REGEXP) || [];
    const getValue = (token) => {
      const match = token.match(/__GROUP(\d+)__/);
      return match ? groups[parseInt(match[1], 10)] : token;
    }
    const parse = (tokens) => {
      const result = [];
      while (tokens.length > 0) {
        const token = tokens.shift();
        if (token === '(') {
          result.push(parse(tokens));
        }
        else if (token === ')') {
          return result;
        }
        else {
          result.push( getValue(token) );
        }
      }
      return result;
    };
    const expressions = parse(tokens);
    return expressions;
  }

  // evaluate javascript expressions
  evaluateJavascript(code, context = {}, { includeHelpers = true } = {}) {
    let result;
    if (includeHelpers) {
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

      // Create a proxy handler that automatically resolves signals and functions
      // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with#creating_dynamic_namespaces_using_the_with_statement_and_a_proxy>
      const proxyHandler = {
        has(target, key) {
          if(key in target) {
            return true;
          }
          return false;
        },
        get(target, prop) {
          const value = target[prop];
          if (value instanceof Signal) {
            return value.get();
          }
          // we need a second internal proxy
          // to correctly pass through args for case getValue(a,b,c)
          // since we also need to convert getValue to getValue()
          if (isFunction(value)) {
            return new Proxy(value, {
              apply(targetFn, thisArg, args) {
                return targetFn.apply(thisArg, args);
              }
            });
          }
          return value;
        }
      };

      // Create a proxy for the context
      const proxiedContext = new Proxy({...context}, proxyHandler);

      // Use with statement to set the evaluation scope to our proxy
      result = new Function('ctx', `
        with (ctx) {
          return ${code};
        }
      `)(proxiedContext);
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

    // lets try to evaluate this expression directly if possible
    if (isString(expression)) {
      const value = this.lookupTokenValue(expression, data);

      if (value !== undefined) {
        // if we found a value and we are recursing we will need to return the function
        // to pass through arguments
        visited.delete(expression);
        if(visited.size > 0) {
          return value;
        }

        // otherwise it is safe to call it directly
        return wrapFunction(value)();
      }
    }

    // we will need to parse this expression by token
    let expressionArray;
    if(!isArray(expression)) {
      // wrap {} or [] in parens if used in lisp style like `getValue { foo: 'baz' }`
      expression = this.addParensToExpression(expression);
      expressionArray = this.getExpressionArray(expression);
    }
    else {
      expressionArray = expression;
    }

    let funcArguments = [];
    let result;

    let index = expressionArray.length;
    while (index--) {
      const token = expressionArray[index];
      if (isArray(token)) {
        // this expression is itself a Lisp style expression
        result = this.lookupExpressionValue(token.join(' '), data, visited);
        funcArguments.unshift(result);
      }
      else {
        // this expression might be a single token
        const tokenValue = this.lookupExpressionValue(token, data, visited);
        result = isFunction(tokenValue)
          ? tokenValue(...funcArguments)
          : tokenValue;
        funcArguments.unshift(result);
      }
    }
    visited.delete(expression);
    return result;
  }

  lookupTokenValue(token = '', data) {
    if (isArray(token)) {
      // Recursively evaluate nested expressions
      return this.lookupExpressionValue(token, data);
    }
    // check if this is a value not requiring lookup
    const literalValue = this.getLiteralValue(token);
    if (literalValue !== undefined) {
      return literalValue;
    }

    // retrieve token value from data context
    let dataValue = this.getDeepDataValue(data, token);
    let value = this.accessTokenValue(dataValue, token, data);
    if (value !== undefined) {
      return value;
    }

    // check if whole token is JS before tokenizing
    const jsValue = this.evaluateJavascript(token, data);
    if (jsValue !== undefined) {
      return this.accessTokenValue(jsValue, token, data);
    }

    // if undefined check if global helper
    const helper = this.helpers[token];
    if (isFunction(helper)) {
      return helper;
    }
  }

  getDeepDataValue(obj, path) {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined) {
        return undefined;
      }
      const current = (acc instanceof Signal)
        ? acc.get()
        : wrapFunction(acc)();
      if (current == undefined) {
        return undefined;
        /* erroring on intermediate undefined
           feels better not as an error state
          but this may change
        */
        // fatal(`Error evaluating expression "${path}"`);
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
    if (isFunction(tokenValue) && token.search('.') !== -1) {
      const thisContext = getThisContext(token, data);
      tokenValue = tokenValue.bind(thisContext);
    }

    if (tokenValue !== undefined) {
      return (tokenValue instanceof Signal)
        ? tokenValue.value
        : tokenValue;
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
    if (token.length > 1 && (token[0] === "'" || token[0] === '"') && token[0] === token[token.length - 1]) {
      return token.slice(1, -1).replace(/\\(['"])/g, '$1');
    }

    // check if this is a boolean
    const boolString = { true: true, false: false };
    if (boolString[token] !== undefined) {
      return boolString[token];
    }

    // check if this is a number
    if (Number.isFinite(+token)) {
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

  // subtrees are rendered as separate contexts stored as weakrefs for gc
  renderContent({ ast, data, isSVG = this.isSVG } = {}) {
    const contentID = LitRenderer.getID({ ast, data, isSVG });
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
      if (tree) {
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
      if (this.data[name] !== value) {
        this.data[name] = value;
      }
    });
  }

  clearTemp() {
    delete this.lastHTML; // used to concat concurrent html
  }
}
