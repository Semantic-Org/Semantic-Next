Micro-Optimizations for ExpressionEvaluator (V8-targeted)
After synthesizing the analysis from multiple expert reviews, here are the highest-impact optimizations ranked by expected benefit, followed by a complete integrated rewrite.

Top-Priority Optimizations
1. Replace isArray/isFunction/isString with built-ins on hot paths
These utility imports add function call overhead that V8 cannot always inline. On hot paths, use typeof and Array.isArray directly.

// Instead of: isFunction(value)
typeof value === 'function'

// Instead of: isArray(token)
Array.isArray(token)

// Instead of: isString(expression)
typeof expression === 'string'
Why it matters: V8 inlines typeof comparisons into machine code. Utility wrappers add call overhead and may block TurboFan inlining.

2. Specialize function invocation for common arities (0–3 args)
The current code allocates an array and uses spread for every function call:

// Before: always allocates args array
const args = new Array(argCount);
for (let a = 0; a < argCount; a++) args[a] = results[index + 1 + a];
result = tokenValue(...args);

// After: specialize common cases
switch (argCount) {
  case 0: result = tokenValue(); break;
  case 1: result = tokenValue(results[index + 1]); break;
  case 2: result = tokenValue(results[index + 1], results[index + 2]); break;
  case 3: result = tokenValue(results[index + 1], results[index + 2], results[index + 3]); break;
  default: {
    const args = new Array(argCount);
    for (let a = 0; a < argCount; a++) args[a] = results[index + 1 + a];
    result = tokenValue(...args);
  }
}
Why it matters: Rest-args array allocation is expensive. Template helpers overwhelmingly take 0–3 arguments. Direct calls use V8's optimized calling convention.

3. Hoist static regexps and caches to module scope
Accessing ExpressionEvaluator.classifyCache goes through a property lookup on the constructor each time. Module-level const bindings are resolved at compile time by TurboFan.

const PARENS_REGEXP = /\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\)/g;
const TOKEN_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
const SIMPLE_PATH_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*(\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/;
// ... etc.

const fnCache = new Map();
const classifyCache = new Map();
const parseCache = new Map();
Why it matters: Avoids megamorphic inline cache misses on repeated static property access in hot loops.

4. Eliminate token.join(' ') allocation in recursive evaluation
The current code reconstructs a string from an array just to recurse:

// Before
result = this.lookupExpressionValue(token.join(' '), data, visited);

// After — pass the array directly
result = this.lookupExpressionValue(token, data, visited);
The visited Set can hold both string and array references. The code already handles array expressions via isArray(expression).

Why it matters: join(' ') allocates a new string on every nested expression — this is one of the biggest allocation sources in the evaluator.

5. Cache dotted path segments instead of per-lookup substring
const pathCache = new Map();
const PATH_CACHE_MAX = 5000;

function getPathSegments(path) {
  let segs = pathCache.get(path);
  if (segs !== undefined) return segs;
  segs = path.split('.');
  if (pathCache.size >= PATH_CACHE_MAX) pathCache.clear();
  pathCache.set(path, segs);
  return segs;
}
Why it matters: path.substring(start, end) allocates a new string per segment per lookup. Caching eliminates repeated allocation for the same paths across renders.

6. Thread precomputed dotIndex through the call chain
lookupTokenValue already computes token.indexOf('.'). Pass it to getDeepDataValue and accessTokenValue instead of recomputing:

lookupTokenValue(token, data) {
  // ...
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) {
    // simple property lookup
  } else {
    const dataValue = this.getDeepDataValue(data, token, dotIndex);
    const value = this.accessTokenValue(dataValue, token, data, dotIndex);
    // ...
  }
}
7. Simplify evaluateJavascript signature — avoid options object allocation
// Before
evaluateJavascript(code, context, { includeHelpers = true } = {}) {

// After — direct boolean parameter
evaluateJavascript(code, context, includeHelpers) {
  // includeHelpers defaults to true when undefined
  if (includeHelpers !== false) { ... }
Why it matters: Destructuring an options object allocates on every call in V8 unless the call site is monomorphic with a literal object.

8. Quick-exit in addParensToExpression
addParensToExpression(expression) {
  if (!expression) return '';
  if (expression.indexOf('[') === -1 && expression.indexOf('{') === -1) {
    return expression;
  }
  WRAPPED_EXPRESSION.lastIndex = 0;
  return expression.replace(WRAPPED_EXPRESSION, (match, before, brackets, after) =>
    `${before}(${brackets})${after}`
  );
}
9. Optimize getLiteralValue with charCodeAt and skip unnecessary work
getLiteralValue(token) {
  const c0 = token.charCodeAt(0);

  // String literals: ' (39) or " (34)
  if (c0 === 39 || c0 === 34) {
    if (token.length > 1 && token.charCodeAt(token.length - 1) === c0) {
      const inner = token.substring(1, token.length - 1);
      // Only replace if there's actually a backslash
      return inner.indexOf('\\') !== -1 ? inner.replace(/\\(['"])/g, '$1') : inner;
    }
    return undefined;
  }

  // Booleans — check first char
  if (c0 === 116 && token === 'true') return true;
  if (c0 === 102 && token === 'false') return false;

  // Numbers
  if ((c0 >= 48 && c0 <= 57) || c0 === 45 || c0 === 46 || c0 === 43) {
    const num = +token;
    if (num === num && num !== Infinity && num !== -Infinity) return num;
  }

  return undefined;
}
10. Conditional getValue in getExpressionArray
When no parenthesized groups were captured (common case), skip the regex test per token:

const getValue = groups.length > 0
  ? (token) => {
      if (token.length > 9 && token.charCodeAt(0) === 95 && token.charCodeAt(1) === 95
          && token.startsWith('__GROUP') && token.endsWith('__')) {
        return groups[+token.slice(7, -2)];
      }
      return token;
    }
  : (token) => token;
Medium-Priority Optimizations
11. Simplify visited set logic on the fast return path
// Before — extra branching
if (value !== undefined) {
  if (visited) {
    visited.delete(expression);
    if (visited.size > 0) {
      return value;
    }
  }
  return typeof value === 'function' ? value() : value;
}

// After
if (value !== undefined) {
  if (visited) visited.delete(expression);
  return typeof value === 'function' ? value() : value;
}
12. Early fast-path for single-token expressions
Before hitting the classify cache, most expressions are simple identifiers:

if (typeof expression === 'string') {
  // Cheap char scan — no space, no parens
  if (expression.indexOf(' ') === -1 && expression.indexOf('(') === -1) {
    const value = this.lookupTokenValue(expression, data);
    if (value !== undefined) {
      if (visited) visited.delete(expression);
      return typeof value === 'function' ? value() : value;
    }
  } else {
    const isMultiTokenLisp = this.classifyExpression(expression);
    // ...
  }
}
13. Reset lastIndex on global regexps reused across calls
When hoisting regexps to module scope, global regexps retain state:

PARENS_REGEXP.lastIndex = 0;
TOKEN_REGEXP.lastIndex = 0;
Approaches to Avoid
Based on council consensus, these suggestions were evaluated and rejected:

WeakMap caching for Signal values — Signals are reactive; caching their values would break reactivity semantics.
Manual char-by-char string building for quote stripping — resultStr += char is O(n²) in many engines and slower than regex replace.
LRU eviction via cache.keys().next().value — Allocates iterators per eviction; batch clear() amortizes better.
Replacing instanceof Signal — V8 handles instanceof efficiently for monomorphic shapes; structural alternatives add checks on the common non-Signal path.
Fabricated speedup estimates (e.g., "2.8×") — Without benchmarks, specific multiplier claims are misleading.
Complete Integrated Rewrite
import { Signal } from '@semantic-ui/reactivity';

// Module-level constants — resolved at compile time by TurboFan
const PARENS_REGEXP = /\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\)/g;
const TOKEN_REGEXP = /('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;
const WRAPPED_EXPRESSION = /(\s|^)([\[{].*?[\]}])(\s|$)/g;
const SIMPLE_PATH_REGEXP = /^[a-zA-Z_$][0-9a-zA-Z_$]*(\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/;
const JS_OPERATOR_REGEXP = /[+\-*/%=<>!&|?:~^`()[\]]/;
const QUOTED_STRING_REGEXP = /('[^']*'|"[^"]*")/g;

const FN_CACHE_MAX = 5000;
const CLASSIFY_CACHE_MAX = 5000;
const PARSE_CACHE_MAX = 5000;
const PATH_CACHE_MAX = 5000;

const fnCache = new Map();
const classifyCache = new Map();
const parseCache = new Map();
const pathCache = new Map();

function getPathSegments(path) {
  let segs = pathCache.get(path);
  if (segs !== undefined) return segs;
  segs = path.split('.');
  if (pathCache.size >= PATH_CACHE_MAX) pathCache.clear();
  pathCache.set(path, segs);
  return segs;
}

const jsNoHelpersHandler = {
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
  // Backward-compat static references
  static fnCache = fnCache;
  static classifyCache = classifyCache;
  static parseCache = parseCache;
  static PARENS_REGEXP = PARENS_REGEXP;
  static TOKEN_REGEXP = TOKEN_REGEXP;
  static WRAPPED_EXPRESSION = WRAPPED_EXPRESSION;
  static SIMPLE_PATH_REGEXP = SIMPLE_PATH_REGEXP;
  static JS_OPERATOR_REGEXP = JS_OPERATOR_REGEXP;
  static QUOTED_STRING_REGEXP = QUOTED_STRING_REGEXP;
  static FN_CACHE_MAX = FN_CACHE_MAX;
  static CLASSIFY_CACHE_MAX = CLASSIFY_CACHE_MAX;
  static PARSE_CACHE_MAX = PARSE_CACHE_MAX;

  constructor({ data, helpers, dataVersion } = {}) {
    this.data = data;
    this.helpers = helpers || {};
    this.dataVersion = dataVersion;
    this.jsContext = null;

    const self = this;
    this.jsProxy = new Proxy(Object.create(null), {
      has(_, key) {
        if (key === 'debugger') return false;
        const ctx = self.jsContext;
        return (ctx !== null && key in ctx) || key in self.helpers;
      },
      get(_, prop) {
        const ctx = self.jsContext;
        const value = (ctx !== null && prop in ctx)
          ? ctx[prop]
          : self.helpers[prop];
        return value instanceof Signal ? value.get() : value;
      },
    });
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

  classifyExpression(expression) {
    let result = classifyCache.get(expression);
    if (result !== undefined) return result;

    const hasQuotes = expression.indexOf("'") !== -1 || expression.indexOf('"') !== -1;
    const stripped = hasQuotes
      ? expression.replace(QUOTED_STRING_REGEXP, '')
      : expression;
    result = stripped.indexOf(' ') !== -1
      && !JS_OPERATOR_REGEXP.test(stripped);

    if (classifyCache.size >= CLASSIFY_CACHE_MAX) classifyCache.clear();
    classifyCache.set(expression, result);
    return result;
  }

  getParsedExpression(expression) {
    let parsed = parseCache.get(expression);
    if (parsed !== undefined) return parsed;

    const wrapped = this.addParensToExpression(expression);
    parsed = this.getExpressionArray(wrapped);

    if (parseCache.size >= PARSE_CACHE_MAX) parseCache.clear();
    parseCache.set(expression, parsed);
    return parsed;
  }

  getExpressionArray(expr) {
    const groups = [];
    PARENS_REGEXP.lastIndex = 0;
    const processedExpr = expr.replace(PARENS_REGEXP, match => {
      const placeholder = `__GROUP${groups.length}__`;
      groups.push(match.slice(1, -1));
      return placeholder;
    });

    TOKEN_REGEXP.lastIndex = 0;
    const tokens = processedExpr.match(TOKEN_REGEXP) || [];

    const groupLen = groups.length;
    const getValue = groupLen > 0
      ? (token) => {
          if (token.length > 9 && token.charCodeAt(0) === 95 && token.charCodeAt(1) === 95
              && token.startsWith('__GROUP') && token.endsWith('__')) {
            return groups[+token.slice(7, -2)];
          }
          return token;
        }
      : (token) => token;

    let pos = 0;
    const tLen = tokens.length;
    const parse = () => {
      const result = [];
      while (pos < tLen) {
        const token = tokens[pos++];
        if (token === '(') {
          result.push(parse());
        } else if (token === ')') {
          return result;
        } else {
          result.push(getValue(token));
        }
      }
      return result;
    };
    return parse();
  }

  evaluateJavascript(code, context, includeHelpers) {
    let result;
    try {
      if (includeHelpers !== false) {
        this.jsContext = context || null;
      }
      const proxy = includeHelpers !== false
        ? this.jsProxy
        : new Proxy(context || {}, jsNoHelpersHandler);
      let fn = fnCache.get(code);
      if (!fn) {
        fn = new Function('ctx', `with(ctx){return ${code}}`);
        if (fnCache.size >= FN_CACHE_MAX) fnCache.clear();
        fnCache.set(code, fn);
      }
      result = fn(proxy);
    } catch (e) {
      // token is not valid javascript
    } finally {
      this.jsContext = null;
    }
    return result;
  }

  lookupExpressionValue(expression, data, visited) {
    if (data === undefined) data = {};

    if (visited) {
      if (visited.has(expression)) return undefined;
      visited.add(expression);
    }

    if (typeof expression === 'string') {
      // Fast path: single token (no spaces or parens)
      const hasSpace = expression.indexOf(' ') !== -1;
      const hasParen = hasSpace ? false : expression.indexOf('(') !== -1;

      if (!hasSpace && !hasParen) {
        const value = this.lookupTokenValue(expression, data);
        if (value !== undefined) {
          if (visited) visited.delete(expression);
          return typeof value === 'function' ? value() : value;
        }
      } else {
        const isMultiTokenLisp = this.classifyExpression(expression);
        if (!isMultiTokenLisp) {
          const value = this.lookupTokenValue(expression, data);
          if (value !== undefined) {
            if (visited) visited.delete(expression);
            return typeof value === 'function' ? value() : value;
          }
        }
      }
    }

    const expressionArray = Array.isArray(expression)
      ? expression
      : this.getParsedExpression(expression);

    if (!visited) {
      visited = new Set();
      visited.add(expression);
    }

    const len = expressionArray.length;
    const results = new Array(len);

    let index = len;
    while (index--) {
      const token = expressionArray[index];
      let result;
      if (Array.isArray(token)) {
        // Pass array directly — avoid join(' ') allocation
        result = this.lookupExpressionValue(token, data, visited);
      } else {
        const tokenValue = this.lookupExpressionValue(token, data, visited);
        if (typeof tokenValue === 'function') {
          const argCount = len - index - 1;
          switch (argCount) {
            case 0: result = tokenValue(); break;
            case 1: result = tokenValue(results[index + 1]); break;
            case 2: result = tokenValue(results[index + 1], results[index + 2]); break;
            case 3: result = tokenValue(results[index + 1], results[index + 2], results[index + 3]); break;
            default: {
              const args = new Array(argCount);
              for (let a = 0; a < argCount; a++) args[a] = results[index + 1 + a];
              result = tokenValue(...args);
            }
          }
        } else {
          result = tokenValue;
        }
      }
      results[index] = result;
    }
    visited.delete(expression);
    return results[0];
  }

  lookupTokenValue(token, data) {
    if (Array.isArray(token)) {
      return this.lookupExpressionValue(token, data);
    }

    const literalValue = this.getLiteralValue(token);
    if (literalValue !== undefined) return literalValue;

    const dotIndex = token.indexOf('.');
    if (dotIndex === -1) {
      const value = data[token];
      if (value instanceof Signal) return value.value;
      if (value !== undefined) return value;
    } else {
      const dataValue = this.getDeepDataValue(data, token, dotIndex);
      const value = this.accessTokenValue(dataValue, token, data, dotIndex);
      if (value !== undefined) return value;
    }

    const helper = this.helpers[token];
    if (typeof helper === 'function') return helper;

    if (SIMPLE_PATH_REGEXP.test(token)) return;

    const jsValue = this.evaluateJavascript(token, data);
    if (jsValue !== undefined) {
      return this.accessTokenValue(jsValue, token, data, dotIndex);
    }
  }

  getDeepDataValue(obj, path, firstDot) {
    if (firstDot === -1) {
      const value = obj[path];
      return value instanceof Signal ? value.get() : value;
    }

    const segs = getPathSegments(path);
    let current = obj;
    for (let i = 0; i < segs.length; i++) {
      if (current instanceof Signal) {
        current = current.get();
      } else if (typeof current === 'function') {
        current = current();
      }
      if (current == null) return undefined;
      current = current[segs[i]];
    }
    return current;
  }

  accessTokenValue(tokenValue, token, data, dotIndex) {
    if (typeof tokenValue === 'function' && dotIndex !== -1) {
      const lastDot = token.lastIndexOf('.');
      const thisContext = this.getDeepDataValue(data, token.substring(0, lastDot), token.indexOf('.'));
      tokenValue = tokenValue.bind(thisContext);
    }

    if (tokenValue !== undefined) {
      return tokenValue instanceof Signal ? tokenValue.value : tokenValue;
    }
    return undefined;
  }

  addParensToExpression(expression) {
    if (!expression) return '';
    if (expression.indexOf('[') === -1 && expression.indexOf('{') === -1) {
      return expression;
    }
    WRAPPED_EXPRESSION.lastIndex = 0;
    return expression.replace(WRAPPED_EXPRESSION, (match, before, brackets, after) => {
      return `${before}(${brackets})${after}`;
    });
  }

  getLiteralValue(token) {
    const c0 = token.charCodeAt(0);

    // String literals
    if (c0 === 39 || c0 === 34) {
      if (token.length > 1 && token.charCodeAt(token.length - 1) === c0) {
        const inner = token.substring(1, token.length - 1);
        return inner.indexOf('\\') !== -1 ? inner.replace(/\\(['"])/g, '$1') : inner;
      }
      return undefined;
    }

    // Booleans
    if (c0 === 116 && token === 'true') return true;
    if (c0 === 102 && token === 'false') return false;

    // Numbers
    if ((c0 >= 48 && c0 <= 57) || c0 === 45 || c0 === 46 || c0 === 43) {
      const num = +token;
      if (num === num && num !== Infinity && num !== -Infinity) return num;
    }

    return undefined;
  }
}
Summary of Changes by Impact
| Priority | Optimization | Mechanism | |----------|-------------|-----------| | High | Replace isFunction/isArray/isString with built-ins | Eliminates call overhead; V8 inlines typeof | | High | Specialize function calls for 0–3 args | Avoids rest-args array allocation | | High | Hoist statics to module scope | Avoids megamorphic IC on constructor | | High | Eliminate token.join(' ') | Removes per-recursion string allocation | | High | Cache path segments | Removes per-segment substring allocation | | Medium | Thread dotIndex through calls | Avoids redundant indexOf('.') | | Medium | Direct boolean instead of options object | Avoids per-call destructuring allocation | | Medium | Quick-exit addParensToExpression | Skips regex when no brackets present | | Medium | charCodeAt in getLiteralValue | Faster integer comparison vs string equality | | Medium | Early single-token fast path | Bypasses classification for simple tokens | | Low | Conditional getValue in parser | Skips group regex when no groups exist | | Low | lastIndex reset on global regexps | Prevents subtle reuse bugs | | Low | num === num instead of Number.isFinite | Avoids function call (marginal) |

Important caveat: The with(ctx) + Proxy pattern used for JS evaluation is an inherent optimization ceiling in V8. If benchmarks show significant time spent in evaluateJavascript, the next level of optimization would involve compiling simple expressions to direct property access, bypassing with/Proxy entirely — but that goes beyond micro-optimization.
