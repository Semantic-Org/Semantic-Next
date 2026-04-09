import { Signal } from '@semantic-ui/reactivity';
import { isArray, isFunction, isString } from '@semantic-ui/utils';

const jsProxyHandler = {
  has(target, key) {
    return key in target;
  },
  get(target, prop) {
    const value = target[prop];
    if (value instanceof Signal) {
      return value.get();
    }
    return value;
  },
};

export class ExpressionEvaluator {
  static PARENS_REGEXP = /\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\)/g;
  static TOKEN_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
  static WRAPPED_EXPRESSION = /(\s|^)([\[{].*?[\]}])(\s|$)/g;
  static VAR_NAME_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
  static SIMPLE_PATH_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*(\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/;
  static JS_OPERATOR_REGEXP = /[+\-*/%=<>!&|?:~^`()[\]]/;
  static QUOTED_STRING_REGEXP = /('[^']*'|"[^"]*")/g;
  static fnCache = new Map();

  constructor({ data, helpers, dataVersion } = {}) {
    this.data = data;
    this.helpers = helpers || {};
    this.dataVersion = dataVersion;
  }

  setData(data) {
    this.data = data;
  }

  evaluate(expression, data = this.data) {
    if (typeof expression === 'string') {
      if (this.dataVersion) {
        this.dataVersion.get();
      }
      return this.lookupExpressionValue(expression, data);
    }
    return expression;
  }

  // parses an expression like 'maybe (isEven number)' to ['maybe, ['isEven', 'number']]
  getExpressionArray(expr) {
    const groups = [];
    const processedExpr = expr.replace(ExpressionEvaluator.PARENS_REGEXP, match => {
      const placeholder = `__GROUP${groups.length}__`;
      groups.push(match.slice(1, -1));
      return placeholder;
    });

    const tokens = processedExpr.match(ExpressionEvaluator.TOKEN_REGEXP) || [];
    const getValue = (token) => {
      const match = token.match(/__GROUP(\d+)__/);
      return match ? groups[parseInt(match[1], 10)] : token;
    };
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
          result.push(getValue(token));
        }
      }
      return result;
    };
    return parse(tokens);
  }

  evaluateJavascript(code, context = {}, { includeHelpers = true } = {}) {
    let result;
    if (includeHelpers) {
      context = {
        ...this.helpers,
        ...context,
      };
      delete context['debugger'];
    }
    try {
      const proxiedContext = new Proxy(context, jsProxyHandler);
      let fn = ExpressionEvaluator.fnCache.get(code);
      if (!fn) {
        fn = new Function('ctx', `with(ctx){return ${code}}`);
        if (ExpressionEvaluator.fnCache.size > 10000) {
          ExpressionEvaluator.fnCache.clear();
        }
        ExpressionEvaluator.fnCache.set(code, fn);
      }
      result = fn(proxiedContext);
    }
    catch (e) {
      // this token is not valid javascript
    }
    return result;
  }

  lookupExpressionValue(expression = '', data = {}, visited = new Set()) {
    if (visited.has(expression)) {
      return undefined;
    }
    visited.add(expression);

    if (isString(expression)) {
      // Multi-token Lisp-style expressions (no JS operators outside quotes)
      // resolve via array parsing below — skip the single-token lookup
      // that wastes time in evaluateJavascript for non-JS expressions
      const hasQuotes = expression.includes("'") || expression.includes('"');
      const stripped = hasQuotes
        ? expression.replace(ExpressionEvaluator.QUOTED_STRING_REGEXP, '')
        : expression;
      const isMultiTokenLisp = stripped.includes(' ')
        && !ExpressionEvaluator.JS_OPERATOR_REGEXP.test(stripped);

      if (!isMultiTokenLisp) {
        const value = this.lookupTokenValue(expression, data);

        if (value !== undefined) {
          visited.delete(expression);
          if (visited.size > 0) {
            return value;
          }
          return isFunction(value) ? value() : value;
        }
      }
    }

    let expressionArray;
    if (!isArray(expression)) {
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
        result = this.lookupExpressionValue(token.join(' '), data, visited);
        funcArguments.unshift(result);
      }
      else {
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
      return this.lookupExpressionValue(token, data);
    }

    const literalValue = this.getLiteralValue(token);
    if (literalValue !== undefined) {
      return literalValue;
    }

    // Fast path: simple identifier — skip getDeepDataValue + accessTokenValue overhead
    if (!token.includes('.')) {
      let value = data[token];
      if (value instanceof Signal) {
        return value.value;
      }
      if (value !== undefined) {
        return value;
      }
    }
    else {
      let dataValue = this.getDeepDataValue(data, token);
      let value = this.accessTokenValue(dataValue, token, data);
      if (value !== undefined) {
        return value;
      }
    }

    const helper = this.helpers[token];
    if (isFunction(helper)) {
      return helper;
    }

    // Simple identifiers and dotted paths are fully resolved by
    // data lookup and helper check above — skip expensive JS eval
    if (ExpressionEvaluator.SIMPLE_PATH_REGEXP.test(token)) {
      return;
    }

    const jsValue = this.evaluateJavascript(token, data);
    if (jsValue !== undefined) {
      return this.accessTokenValue(jsValue, token, data);
    }
  }

  getDeepDataValue(obj, path) {
    let dot = path.indexOf('.');

    // Fast path: simple identifier (no dots)
    if (dot === -1) {
      const value = obj[path];
      if (value instanceof Signal) {
        return value.get();
      }
      return value;
    }

    // Walk segments via indexOf to avoid split() array allocation on hot path
    let current = obj;
    let start = 0;
    let end = dot;
    while (start < path.length) {
      if (current instanceof Signal) {
        current = current.get();
      }
      else if (typeof current === 'function') {
        current = current();
      }
      if (current == null) {
        return undefined;
      }
      current = current[path.substring(start, end)];
      start = end + 1;
      end = path.indexOf('.', start);
      if (end === -1) {
        end = path.length;
      }
    }
    return current;
  }

  accessTokenValue(tokenValue, token, data) {
    if (isFunction(tokenValue) && token.includes('.')) {
      const lastDot = token.lastIndexOf('.');
      const thisContext = this.getDeepDataValue(data, token.substring(0, lastDot));
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
    return String(expression).replace(ExpressionEvaluator.WRAPPED_EXPRESSION, (match, before, brackets, after) => {
      return `${before}(${brackets})${after}`;
    });
  }

  getLiteralValue(token) {
    if (token.length > 1 && (token[0] === "'" || token[0] === '"') && token[0] === token[token.length - 1]) {
      return token.slice(1, -1).replace(/\\(['"])/g, '$1');
    }

    if (token === 'true') { return true; }
    if (token === 'false') { return false; }

    // Quick charCode guard to skip +token coercion for identifiers
    const c = token.charCodeAt(0);
    if ((c >= 48 && c <= 57) || c === 45 || c === 46 || c === 43) {
      const num = +token;
      if (Number.isFinite(num)) {
        return num;
      }
    }
  }
}
