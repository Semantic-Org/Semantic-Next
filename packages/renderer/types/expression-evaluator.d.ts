import { Dependency } from '@semantic-ui/reactivity';
import { DataContext } from '@semantic-ui/templating';
import { Cache } from '@semantic-ui/utils';

/**
 * A parsed Lisp-style expression. Nested arrays are parenthesized
 * sub-expressions: `maybe (isEven number)` parses to
 * `['maybe', ['isEven', 'number']]`.
 */
export type ExpressionArray = Array<string | ExpressionArray>;

/** Settings for a new {@link ExpressionEvaluator}. */
export interface ExpressionEvaluatorSettings {
  /** Data context expressions resolve against. */
  data?: DataContext;
  /** Template helpers reachable from an expression. */
  helpers?: Record<string, any>;
  /** Coarse invalidation for renderers that receive data from a parent. */
  dataVersion?: Dependency;
}

/**
 * Resolves template expressions against a data context. Handles the four
 * expression shapes: a bare identifier, a dotted path, a Lisp-style helper
 * call, and a JavaScript expression. Signals encountered along the way are
 * unwrapped to their value.
 *
 * Shared by every engine — the native client renderer, the server renderer,
 * and the Lit renderer all evaluate through this class.
 * @see {@link https://next.semantic-ui.com/docs/api/renderer Renderer API Reference}
 */
export class ExpressionEvaluator {
  /** @internal Matches a balanced parenthesized group, up to three levels deep. */
  static PARENS_REGEXP: RegExp;
  /** @internal Splits an expression into quoted strings, parens, and bare tokens. */
  static TOKEN_REGEXP: RegExp;
  /** @internal Matches a bare object or array literal needing parens added. */
  static WRAPPED_EXPRESSION: RegExp;
  /** @internal Matches a legal identifier. */
  static VAR_NAME_REGEXP: RegExp;
  /** @internal Matches an identifier or dotted path with nothing else in it. */
  static SIMPLE_PATH_REGEXP: RegExp;
  /** @internal Matches any character that makes a token JavaScript rather than Lisp. */
  static JS_OPERATOR_REGEXP: RegExp;
  /** @internal Matches single or double quoted string literals. */
  static QUOTED_STRING_REGEXP: RegExp;

  /** @internal Compiled JavaScript expression functions, keyed by source. */
  static fnCache: Cache<string, Function>;
  /** @internal Whether an expression is multi-token Lisp, keyed by source. */
  static classifyCache: Cache<string, boolean>;
  /** @internal Parsed expression arrays, keyed by source. */
  static parseCache: Cache<string, ExpressionArray>;
  /** @internal Split dotted paths, keyed by path. */
  static pathSegmentsCache: Cache<string, string[]>;

  /**
   * Creates an evaluator bound to a data context and helper set.
   * @param settings - Data context, helpers, and optional data version dependency
   */
  constructor(settings?: ExpressionEvaluatorSettings);

  /** Data context expressions resolve against. */
  data?: DataContext;
  /** Template helpers reachable from an expression. */
  helpers: Record<string, any>;
  /** Coarse invalidation dependency, depended on by {@link evaluate}. */
  dataVersion?: Dependency;
  /** @internal Context the reusable JS Proxy currently reads from. */
  jsContext: DataContext | null;
  /** @internal Reused Proxy backing `with(ctx)` evaluation of JS expressions. */
  jsProxy: Record<string, any>;

  /**
   * Replaces the data context. Existing caches are keyed on expression source
   * only, so they stay valid.
   * @param data - New data context
   */
  setData(data: DataContext): void;

  /**
   * Resolves an expression string against a data context, registering a
   * dependency on `dataVersion` when one was supplied.
   * @param expression - Expression source
   * @param data - Data context, defaults to the evaluator's own
   */
  evaluate(expression: string, data?: DataContext): any;
  /**
   * Passes a non-string value through unchanged. Compiled AST nodes carry
   * literals in expression slots, and those need no resolution.
   * @param expression - Value returned as-is
   * @param data - Ignored for non-string input
   */
  evaluate<T>(expression: T, data?: DataContext): T;

  /**
   * Whether an expression is a multi-token Lisp-style call rather than
   * JavaScript. Cached on the expression source.
   * @param expression - Expression source
   */
  classifyExpression(expression: string): boolean;

  /**
   * Parses an expression into its nested token array, memoized on the source.
   * @param expression - Expression source
   */
  getParsedExpression(expression: string): ExpressionArray;

  /**
   * Parses an expression into its nested token array without consulting the cache.
   * @param expr - Expression source, parens already normalized
   */
  getExpressionArray(expr: string): ExpressionArray;

  /**
   * Evaluates a JavaScript expression against a context. Returns `undefined`
   * when the source is not valid JavaScript — callers treat that as "not a JS
   * expression" rather than an error.
   * @param code - JavaScript source
   * @param context - Data context exposed to the expression
   * @param options - Whether helpers are in scope, defaults to `true`
   */
  evaluateJavascript(
    code: string,
    context?: DataContext,
    options?: { includeHelpers?: boolean; },
  ): any;

  /**
   * Resolves an expression, recursing into sub-expressions and calling helpers
   * with the values to their right.
   * @param expression - Expression source, or an already-parsed token array
   * @param data - Data context
   * @param visited - Cycle guard, seeded automatically when recursion begins
   */
  lookupExpressionValue(
    expression?: string | ExpressionArray,
    data?: DataContext,
    visited?: Set<string | ExpressionArray>,
  ): any;

  /**
   * Resolves a single token: a literal, a data value, a helper, or a JavaScript
   * expression, in that order.
   * @param token - Token source, or a nested token array
   * @param data - Data context
   */
  lookupTokenValue(token: string | ExpressionArray, data: DataContext): any;

  /**
   * Splits a dotted path into segments, memoized on the path.
   * @param path - Dotted path
   */
  getPathSegments(path: string): string[];

  /**
   * Walks a dotted path, unwrapping Signals and calling functions along the way.
   * @param obj - Object to traverse
   * @param path - Identifier or dotted path
   */
  getDeepDataValue(obj: any, path: string): any;

  /**
   * Finishes a token lookup: binds a method to the object it was read from and
   * unwraps a Signal value.
   * @param tokenValue - Raw value read for the token
   * @param token - Token source, used to recover the method's receiver
   * @param data - Data context
   */
  accessTokenValue(tokenValue: any, token: string, data: DataContext): any;

  /**
   * Wraps bare object and array literals in parens so the tokenizer keeps them
   * together.
   * @param expression - Expression source
   */
  addParensToExpression(expression?: string): string;

  /**
   * Reads a token as a literal, returning `undefined` when it is not one.
   * @param token - Token source
   */
  getLiteralValue(token: string): string | number | boolean | null | undefined;
}
