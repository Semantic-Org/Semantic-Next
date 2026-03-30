import { Signal } from '@semantic-ui/reactivity';
import { filterObject, isArray, isFunction, isString, wrapFunction } from '@semantic-ui/utils';

export class ExpressionEvaluator {
  static PARENS_REGEXP = /\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\)/g;
  static TOKEN_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
  static WRAPPED_EXPRESSION = /(\s|^)([\[{].*?[\]}])(\s|$)/g;
  static VAR_NAME_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;

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
      context = filterObject(context, (value, name) => {
        const reservedWords = ['debugger'];
        return !reservedWords.includes(name) && ExpressionEvaluator.VAR_NAME_REGEXP.test(name);
      });
    }
    try {
      const proxyHandler = {
        has(target, key) {
          if (key in target) {
            return true;
          }
          return false;
        },
        get(target, prop) {
          const value = target[prop];
          if (value instanceof Signal) {
            return value.get();
          }
          if (isFunction(value)) {
            return new Proxy(value, {
              apply(targetFn, thisArg, args) {
                return targetFn.apply(thisArg, args);
              },
            });
          }
          return value;
        },
      };

      const proxiedContext = new Proxy({ ...context }, proxyHandler);
      result = new Function(
        'ctx',
        `
        with (ctx) {
          return ${code};
        }
      `,
      )(proxiedContext);
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
      const value = this.lookupTokenValue(expression, data);

      if (value !== undefined) {
        visited.delete(expression);
        if (visited.size > 0) {
          return value;
        }
        return wrapFunction(value)();
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

    let dataValue = this.getDeepDataValue(data, token);
    let value = this.accessTokenValue(dataValue, token, data);
    if (value !== undefined) {
      return value;
    }

    const jsValue = this.evaluateJavascript(token, data);
    if (jsValue !== undefined) {
      return this.accessTokenValue(jsValue, token, data);
    }

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
      }
      return current[part];
    }, obj);
  }

  accessTokenValue(tokenValue, token, data) {
    const getThisContext = (token, data) => {
      const path = token.split('.').slice(0, -1).join('.');
      return this.getDeepDataValue(data, path);
    };

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
    return String(expression).replace(ExpressionEvaluator.WRAPPED_EXPRESSION, (match, before, brackets, after) => {
      return `${before}(${brackets})${after}`;
    });
  }

  getLiteralValue(token) {
    if (token.length > 1 && (token[0] === "'" || token[0] === '"') && token[0] === token[token.length - 1]) {
      return token.slice(1, -1).replace(/\\(['"])/g, '$1');
    }

    const boolString = { true: true, false: false };
    if (boolString[token] !== undefined) {
      return boolString[token];
    }

    if (Number.isFinite(+token)) {
      return Number(token);
    }
  }
}
