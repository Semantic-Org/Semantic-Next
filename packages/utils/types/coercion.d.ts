/**
 * Best-effort type coercion for loose input (attribute strings, query params, JSON)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion Coercion Utilities Documentation}
 */

/**
 * Options for boolean coercion
 */
export interface ToBooleanSettings {
  /** Extra lowercase tokens to treat as false, layered over the built-in set */
  falsy?: string | string[];
  /** Coerce unrecognized input via native truthiness instead of returning null (default: false) */
  loose?: boolean;
}

/**
 * Options for string coercion
 */
export interface ToStringSettings {
  /** Render objects and arrays with JSON instead of returning null, for display output (default: false) */
  loose?: boolean;
}

/**
 * Coerces a value to a boolean, or `null` when it recognizes no boolean reading.
 * Booleans pass through, numbers read by zero-ness, and strings match a generous set
 * (`true`/`t`/`yes`/`y`/`on`/`enabled`, `false`/`f`/`no`/`n`/`off`/`disabled`, plus numeric strings).
 * Under `loose`, unrecognized input falls back to native truthiness and never returns null.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#toboolean toBoolean}
 * @see {@link https://next.semantic-ui.com/examples/utils-toboolean Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns `true`, `false`, or `null` if unrecognized (never null under `loose`)
 *
 * @example
 * ```ts
 * toBoolean('yes') // true
 * toBoolean('off') // false
 * toBoolean('banana') // null
 * toBoolean('banana', { loose: true }) // true
 * ```
 */
export function toBoolean(value: unknown, settings?: ToBooleanSettings): boolean | null;

/**
 * Coerces a value to a finite number, or `null` when it cannot be converted (never `NaN` or `Infinity`).
 * Parses numeric strings via `Number`, reads booleans as `1`/`0`, and rejects blanks,
 * unit-tagged strings, arrays, and objects.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tonumber toNumber}
 * @see {@link https://next.semantic-ui.com/examples/utils-tonumber Example}
 *
 * @param value - The value to coerce
 * @returns The finite number, or `null` if unconvertible
 *
 * @example
 * ```ts
 * toNumber('3.14') // 3.14
 * toNumber('5px') // null
 * toNumber('abc') ?? 0 // 0
 * ```
 */
export function toNumber(value: unknown): number | null;

/**
 * Coerces a value to an integer by truncating toward zero, or `null` when unconvertible or non-finite.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tointeger toInteger}
 * @see {@link https://next.semantic-ui.com/examples/utils-tointeger Example}
 *
 * @param value - The value to coerce
 * @returns The truncated integer, or `null` if unconvertible
 *
 * @example
 * ```ts
 * toInteger('3.9') // 3
 * toInteger('-3.9') // -3
 * toInteger(Infinity) // null
 * ```
 */
export function toInteger(value: unknown): number | null;

/**
 * Coerces a value to a Date, or `null` when it cannot be parsed, never an Invalid Date.
 * Accepts a Date, a number as epoch milliseconds, or an ISO-8601 string. Ambiguous or locale-dependent
 * spellings (bare years, slash or text dates, day overflow) return `null` rather than a guessed date.
 * A zoneless datetime resolves in the ambient timezone (the user's zone on the client), returned as a UTC instant.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#todate toDate}
 * @see {@link https://next.semantic-ui.com/examples/utils-todate Example}
 *
 * @param value - The value to coerce
 * @returns The Date, or `null` if unparseable
 *
 * @example
 * ```ts
 * toDate('2024-01-01') // Date
 * toDate('01/15/2024') // null (ambiguous)
 * toDate(input) ?? new Date() // a valid Date either way
 * ```
 */
export function toDate(value: unknown): Date | null;

/**
 * Coerces a value to a string, or `null` when there is no faithful string form.
 * Strings pass through and a finite `number`, a `boolean`, or a `bigint` goes through `String()`. Objects,
 * arrays, functions, symbols, non-finite numbers, and nullish return `null`. Under `loose`, objects and
 * arrays render with JSON for display output, still returning `null` on unserializable input, never throwing.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tostring toString}
 * @see {@link https://next.semantic-ui.com/examples/utils-tostring Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The string, or `null` if there is no faithful string form
 *
 * @example
 * ```ts
 * toString(42) // '42'
 * toString({ a: 1 }) // null
 * toString({ a: 1 }, { loose: true }) // '{"a":1}'
 * ```
 */
export function toString(value: unknown, settings?: ToStringSettings): string | null;

/** Alias of {@link toBoolean} */
export const coerceBoolean: typeof toBoolean;
/** Alias of {@link toNumber} */
export const coerceNumber: typeof toNumber;
/** Alias of {@link toInteger} */
export const coerceInteger: typeof toInteger;
/** Alias of {@link toDate} */
export const coerceDate: typeof toDate;
/** Alias of {@link toString} */
export const coerceString: typeof toString;
