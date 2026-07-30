import { Signal } from '@semantic-ui/reactivity';
import { createCache } from '@semantic-ui/utils';
import { unwrap } from './helpers.js';

// Fallback handler for the rare includeHelpers: false path
const jsNoHelpersHandler = {
  has(target, key) {
    return key in target;
  },
  get(target, prop) {
    const value = target[prop];
    if (value instanceof Signal) {
      return value.get();
    }
    return unwrap(value);
  },
};

// Rough expression distribution (2026-04-12) — weight optimizations by hot paths:
//
//   ~60%  simple identifier   — direct property lookup
//   ~20%  dotted path         — nested traversal
//   ~20%  Lisp helper         — parsed, cached
//    ~2%  JS eval             — new Function + Proxy
//    <1%  complex Lisp        — inline objects/arrays
export class ExpressionEvaluator {
  static PARENS_REGEXP = /\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\)/g;
  static TOKEN_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
  static WRAPPED_EXPRESSION = /(\s|^)([\[{].*?[\]}])(\s|$)/g;
  static VAR_NAME_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
  static SIMPLE_PATH_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*(\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/;
  static JS_OPERATOR_REGEXP = /[+\-*/%=<>!&|?:~^`()[\]]/;
  static QUOTED_STRING_REGEXP = /('[^']*'|"[^"]*")/g;
  static CALLEE_REGEXP = /([A-Za-z_$][0-9a-zA-Z_$]*)\s*\(/g;
  static fnCache = createCache({ maxSize: 5000, eviction: 'flush' });

  // Identifiers written with a call in a given expression. Deterministic per
  // expression string, same as the parse and classify caches.
  static calleeCache = createCache({ maxSize: 5000, eviction: 'flush' });

  // Expression classification cache — shared across all instances since
  // classification depends only on the expression string, not data context
  static classifyCache = createCache({ maxSize: 5000, eviction: 'flush' });

  // Parsed expression array cache — the result of addParensToExpression +
  // getExpressionArray is deterministic for a given expression string
  static parseCache = createCache({ maxSize: 5000, eviction: 'flush' });

  // Pre-split segments for dotted paths. getDeepDataValue is called per
  // expression read; caching avoids the per-call substring + intern cost.
  static pathSegmentsCache = createCache({ maxSize: 5000, eviction: 'flush' });

  constructor({ data, helpers, dataVersion } = {}) {
    this.data = data;
    this.helpers = helpers || {};
    this.dataVersion = dataVersion;

    // Reusable Proxy for JS expression evaluation — avoids per-eval spread + new Proxy
    this.jsContext = null;
    this.jsCallees = new Set();
    this.jsResolved = null;
    this.jsProxy = new Proxy(
      // Dummy target — the handler reads from jsContext/helpers directly
      Object.create(null),
      {
        has: (_, key) => {
          // Filter 'debugger' to prevent reserved word conflict inside with(ctx){}
          if (key === 'debugger') { return false; }
          return (this.jsContext !== null && key in this.jsContext) || key in this.helpers;
        },
        get: (_, prop) => {
          const value = (this.jsContext !== null && prop in this.jsContext)
            ? this.jsContext[prop]
            : this.helpers[prop];
          if (value instanceof Signal) {
            return value.get();
          }
          if (typeof value === 'function' && !this.jsCallees.has(prop)) {
            return this.resolveJsIdentifier(prop, value);
          }
          return unwrap(value);
        },
      },
    );
  }

  setData(data) {
    this.data = data;
  }

  evaluate(expression, data = this.data) {
    if (typeof expression === 'string') {
      if (this.dataVersion) {
        this.dataVersion.depend();
      }
      return this.lookupExpressionValue(expression, data);
    }
    return expression;
  }

  // Classifies an expression string to determine if it's a multi-token
  // Lisp-style expression (no JS operators outside quotes). Result is
  // cached since it depends only on the expression string.
  classifyExpression(expression) {
    let result = ExpressionEvaluator.classifyCache.get(expression);
    if (result !== undefined) {
      return result;
    }

    const hasQuotes = expression.includes("'") || expression.includes('"');
    const stripped = hasQuotes
      ? expression.replace(ExpressionEvaluator.QUOTED_STRING_REGEXP, '')
      : expression;
    result = stripped.includes(' ')
      && !ExpressionEvaluator.JS_OPERATOR_REGEXP.test(stripped);

    ExpressionEvaluator.classifyCache.set(expression, result);
    return result;
  }

  // Returns a cached parsed expression array. The result of
  // addParensToExpression + getExpressionArray is deterministic for a
  // given expression string — no need to re-parse on every render.
  getParsedExpression(expression) {
    let parsed = ExpressionEvaluator.parseCache.get(expression);
    if (parsed !== undefined) {
      return parsed;
    }

    const wrapped = this.addParensToExpression(expression);
    parsed = this.getExpressionArray(wrapped);

    ExpressionEvaluator.parseCache.set(expression, parsed);
    return parsed;
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

    // Index-based iteration avoids O(n) shift() per token
    let pos = 0;
    const parse = () => {
      const result = [];
      while (pos < tokens.length) {
        const token = tokens[pos++];
        if (token === '(') {
          result.push(parse());
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
    return parse();
  }

  evaluateJavascript(code, context, { includeHelpers = true } = {}) {
    let result;
    try {
      // Reuse the cached Proxy — just swap which context object it reads from
      if (includeHelpers) {
        this.jsContext = context || null;
        this.jsCallees = this.getCallees(code);
      }
      const proxy = includeHelpers ? this.jsProxy : new Proxy(context || {}, jsNoHelpersHandler);
      let fn = ExpressionEvaluator.fnCache.get(code);
      if (!fn) {
        fn = new Function('ctx', `with(ctx){return ${code}}`);
        ExpressionEvaluator.fnCache.set(code, fn);
      }
      result = fn(proxy);
    }
    catch (e) {
      // this token is not valid javascript
    }
    finally {
      this.jsContext = null;
      this.jsResolved = null;
    }
    return result;
  }

  getCallees(code) {
    let callees = ExpressionEvaluator.calleeCache.get(code);
    if (callees !== undefined) {
      return callees;
    }
    callees = new Set();
    const stripped = code.replace(ExpressionEvaluator.QUOTED_STRING_REGEXP, '');
    for (const match of stripped.matchAll(ExpressionEvaluator.CALLEE_REGEXP)) {
      callees.add(match[1]);
    }
    ExpressionEvaluator.calleeCache.set(code, callees);
    return callees;
  }

  // a function in the data context is an accessor here, same as in path syntax.
  // memoized for the evaluation so an identifier written twice still runs its
  // side effects once
  resolveJsIdentifier(name, accessor) {
    const resolved = (this.jsResolved ??= new Map());
    if (resolved.has(name)) {
      return resolved.get(name);
    }
    let value = accessor();
    if (value instanceof Signal) {
      value = value.get();
    }
    value = unwrap(value);
    resolved.set(name, value);
    return value;
  }

  lookupExpressionValue(expression = '', data = {}, visited) {
    if (visited) {
      if (visited.has(expression)) {
        return undefined;
      }
      visited.add(expression);
    }

    if (typeof expression === 'string') {
      // No space = single token (identifier, dotted path, or JS call).
      // Skip classify cache — Lisp-style needs at least one space.
      const isMultiTokenLisp = expression.includes(' ')
        && this.classifyExpression(expression);

      if (!isMultiTokenLisp) {
        const value = this.lookupTokenValue(expression, data);

        if (value !== undefined) {
          if (visited) {
            visited.delete(expression);
            if (visited.size > 0) {
              return value;
            }
          }
          return typeof value === 'function' ? value() : value;
        }
      }
    }

    let expressionArray;
    if (!Array.isArray(expression)) {
      expressionArray = this.getParsedExpression(expression);
    }
    else {
      expressionArray = expression;
    }

    // Create visited Set lazily — only needed when recursing into sub-expressions
    if (!visited) {
      visited = new Set();
      visited.add(expression);
    }

    const len = expressionArray.length;
    // Pre-allocate results array at the right size instead of per-iteration unshift
    const results = new Array(len);

    let index = len;
    while (index--) {
      const token = expressionArray[index];
      let result;
      if (Array.isArray(token)) {
        result = this.lookupExpressionValue(token.join(' '), data, visited);
      }
      else {
        const tokenValue = this.lookupExpressionValue(token, data, visited);
        if (typeof tokenValue === 'function') {
          // Collect arguments from the already-resolved tokens to the
          // right. Unwrap any item-proxy values at this boundary so
          // user-supplied helpers receive the actual item — the proxy
          // is a framework-internal tracking mechanism and shouldn't
          // leak into userland identity, instanceof checks, WeakMap
          // keys, or internal-slot method calls.
          let argCount = len - index - 1;
          if (argCount > 0) {
            const args = new Array(argCount);
            for (let a = 0; a < argCount; a++) {
              args[a] = unwrap(results[index + 1 + a]);
            }
            result = tokenValue(...args);
          }
          else {
            result = tokenValue();
          }
        }
        else {
          result = tokenValue;
        }
      }
      results[index] = result;
    }
    visited.delete(expression);
    return results[0];
  }

  lookupTokenValue(token = '', data) {
    if (Array.isArray(token)) {
      return this.lookupExpressionValue(token, data);
    }

    // Eager path — cheaper than any cache lookup, resolves the 90% case
    const literalValue = this.getLiteralValue(token);
    if (literalValue !== undefined) {
      return literalValue;
    }

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
      const value = this.lookupDottedValue(data, token);
      if (value !== undefined) {
        return value;
      }
    }

    const helper = this.helpers[token];
    if (typeof helper === 'function') {
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

  // one walk, so an accessor on the path runs once per expression. the last segment
  // reads off the container to keep an {#each} item's per-field dep, and only the
  // receiver unwraps
  lookupDottedValue(data, token) {
    const segments = this.getPathSegments(token);
    if (segments === null) { return undefined; }
    const last = segments.length - 1;

    let container = this.walkPath(data, segments, last);
    if (container instanceof Signal) { container = container.get(); }
    else if (typeof container === 'function') { container = container(); }
    if (container == null) { return undefined; }

    const value = container[segments[last]];
    if (typeof value === 'function') { return value.bind(unwrap(container)); }
    return (value instanceof Signal) ? value.value : value;
  }

  // null for anything that isn't a pure dotted path. a JS expression can carry a
  // dot ({board.count + 1}) and walking it speculatively would run an accessor
  // that the JS evaluator is about to run properly
  getPathSegments(path) {
    let segments = ExpressionEvaluator.pathSegmentsCache.get(path);
    if (segments !== undefined) {
      return segments;
    }
    segments = ExpressionEvaluator.SIMPLE_PATH_REGEXP.test(path) ? path.split('.') : null;
    ExpressionEvaluator.pathSegmentsCache.set(path, segments);
    return segments;
  }

  getDeepDataValue(obj, path) {
    // Fast path: simple identifier (no dots)
    if (path.indexOf('.') === -1) {
      const value = obj[path];
      if (value instanceof Signal) {
        return value.get();
      }
      return value;
    }

    const segments = this.getPathSegments(path);
    if (segments === null) { return undefined; }
    return this.walkPath(obj, segments, segments.length);
  }

  walkPath(obj, segments, count) {
    let current = obj;
    for (let i = 0; i < count; i++) {
      if (current instanceof Signal) {
        current = current.get();
      }
      else if (typeof current === 'function') {
        current = current();
      }
      if (current == null) {
        return undefined;
      }
      current = current[segments[i]];
    }
    return current;
  }

  accessTokenValue(tokenValue, token, data) {
    if (typeof tokenValue === 'function' && token.includes('.')) {
      const lastDot = token.lastIndexOf('.');
      const thisContext = this.getThisContext(data, token.substring(0, lastDot));
      tokenValue = tokenValue.bind(thisContext);
    }

    if (tokenValue !== undefined) {
      return (tokenValue instanceof Signal)
        ? tokenValue.value
        : tokenValue;
    }
    return undefined;
  }

  // getDeepDataValue unwraps what it walks through but not what it lands on, and an
  // {#each x in xs} as-key lands on the item proxy. neither is the receiver
  getThisContext(data, path) {
    let parent = this.getDeepDataValue(data, path);
    if (parent instanceof Signal) { parent = parent.value; }
    else if (typeof parent === 'function') { parent = parent(); }
    return unwrap(parent);
  }

  addParensToExpression(expression = '') {
    if (!expression) { return ''; }
    if (expression.indexOf('[') === -1 && expression.indexOf('{') === -1) {
      return expression;
    }
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
    if (token === 'null') { return null; }

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
