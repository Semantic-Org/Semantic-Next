/**
 * Best-effort type coercion for loose input (attribute strings, query params, JSON)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion Coercion Utilities Documentation}
 */

/**
 * How a failed coercion resolves. `null` (the default) erases the value so the result composes with `??`.
 * `passthrough` returns the original value so a downstream validator can flag the bad input.
 */
export type OnInvalid = 'null' | 'passthrough';

/**
 * Options for boolean coercion
 */
export interface ToBooleanSettings {
  /** Extra lowercase tokens to treat as false, layered over the built-in set */
  falsy?: string | string[];
  /** Coerce unrecognized input via native truthiness instead of returning null (default: false) */
  loose?: boolean;
  /** How a failed coercion resolves (default: 'null'). `loose` takes precedence when both are set */
  onInvalid?: OnInvalid;
}

/**
 * Options for number coercion
 */
export interface ToNumberSettings {
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
}

/**
 * Options for integer coercion
 */
export interface ToIntegerSettings {
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
}

/**
 * Options for date coercion
 */
export interface ToDateSettings {
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
}

/**
 * Options for string coercion
 */
export interface ToStringSettings {
  /** Render objects and arrays with JSON instead of returning null, for display output (default: false) */
  loose?: boolean;
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
}

/** Coerces to a boolean, never returning null. @see {@link toBoolean} */
export function toBoolean(value: unknown, settings: ToBooleanSettings & { loose: true; }): boolean;
/** Coerces to a boolean, returning the original value on an unrecognized input. @see {@link toBoolean} */
export function toBoolean<T>(value: T, settings: ToBooleanSettings & { onInvalid: 'passthrough'; }): boolean | T;
/**
 * Coerces a value to a boolean, or `null` when it recognizes no boolean reading.
 * Booleans pass through, numbers read by zero-ness, and strings match a generous set
 * (`true`/`t`/`yes`/`y`/`on`/`enabled`, `false`/`f`/`no`/`n`/`off`/`disabled`, plus numeric strings).
 * Under `loose`, unrecognized input falls back to native truthiness and never returns null. `onInvalid`
 * chooses how a failed coercion resolves, with `loose` taking precedence when both are set.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#toboolean toBoolean}
 * @see {@link https://next.semantic-ui.com/examples/utils-toboolean Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns `true`, `false`, or `null` if unrecognized
 *
 * @example
 * ```ts
 * toBoolean('yes') // true
 * toBoolean('banana') // null
 * toBoolean('banana', { loose: true }) // true
 * toBoolean('banana', { onInvalid: 'passthrough' }) // 'banana'
 * ```
 */
export function toBoolean(value: unknown, settings?: ToBooleanSettings): boolean | null;

/** Coerces to a finite number, returning the original value on failure. @see {@link toNumber} */
export function toNumber<T>(value: T, settings: ToNumberSettings & { onInvalid: 'passthrough'; }): number | T;
/**
 * Coerces a value to a finite number, or `null` when it cannot be converted (never `NaN` or `Infinity`).
 * Parses numeric strings via `Number`, reads booleans as `1`/`0`, and rejects blanks,
 * unit-tagged strings, arrays, and objects. `onInvalid` chooses how a failed coercion resolves.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tonumber toNumber}
 * @see {@link https://next.semantic-ui.com/examples/utils-tonumber Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The finite number, or `null` if unconvertible
 *
 * @example
 * ```ts
 * toNumber('3.14') // 3.14
 * toNumber('5px') // null
 * toNumber('5px', { onInvalid: 'passthrough' }) // '5px'
 * ```
 */
export function toNumber(value: unknown, settings?: ToNumberSettings): number | null;

/** Coerces to an integer, returning the original value on failure. @see {@link toInteger} */
export function toInteger<T>(value: T, settings: ToIntegerSettings & { onInvalid: 'passthrough'; }): number | T;
/**
 * Coerces a value to an integer by truncating toward zero, or `null` when unconvertible or non-finite.
 * `onInvalid` chooses how a failed coercion resolves, always returning the original value rather than a
 * truncated `NaN`.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tointeger toInteger}
 * @see {@link https://next.semantic-ui.com/examples/utils-tointeger Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The truncated integer, or `null` if unconvertible
 *
 * @example
 * ```ts
 * toInteger('3.9') // 3
 * toInteger('-3.9') // -3
 * toInteger(Infinity) // null
 * ```
 */
export function toInteger(value: unknown, settings?: ToIntegerSettings): number | null;

/** Coerces to a Date, returning the original value on failure. @see {@link toDate} */
export function toDate<T>(value: T, settings: ToDateSettings & { onInvalid: 'passthrough'; }): Date | T;
/**
 * Coerces a value to a Date, or `null` when it cannot be parsed, never an Invalid Date.
 * Accepts a Date, a number as epoch milliseconds, or an ISO-8601 string. Ambiguous or locale-dependent
 * spellings (bare years, slash or text dates, day overflow) return `null` rather than a guessed date.
 * A zoneless datetime resolves in the ambient timezone (the user's zone on the client), returned as a UTC
 * instant. `onInvalid` chooses how a failed coercion resolves.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#todate toDate}
 * @see {@link https://next.semantic-ui.com/examples/utils-todate Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The Date, or `null` if unparseable
 *
 * @example
 * ```ts
 * toDate('2024-01-01') // Date
 * toDate('01/15/2024') // null (ambiguous)
 * toDate(input) ?? new Date() // a valid Date either way
 * ```
 */
export function toDate(value: unknown, settings?: ToDateSettings): Date | null;

/** Coerces to a string, returning the original value on failure. @see {@link toString} */
export function toString<T>(value: T, settings: ToStringSettings & { onInvalid: 'passthrough'; }): string | T;
/**
 * Coerces a value to a string, or `null` when there is no faithful string form.
 * Strings pass through and a finite `number`, a `boolean`, or a `bigint` goes through `String()`. Objects,
 * arrays, functions, symbols, non-finite numbers, and nullish return `null`. Under `loose`, objects and
 * arrays render with JSON for display output, still returning `null` on unserializable input, never throwing.
 * `onInvalid` chooses how a failed coercion resolves.
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
