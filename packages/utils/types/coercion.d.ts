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
  /** Tokens to treat as true for this call, winning over the config vocabulary */
  truthy?: string | string[];
  /** Tokens to treat as false for this call, winning over the config vocabulary and a truthy match */
  falsy?: string | string[];
  /** Coerce unrecognized input via native truthiness instead of returning null (default: false) */
  loose?: boolean;
  /** How a failed coercion resolves (default: 'null'). `loose` takes precedence when both are set */
  onInvalid?: OnInvalid;
}

/**
 * The global boolean vocabulary and defaults, read by every {@link toBoolean} call. Set once at app
 * boot (e.g. `toBoolean.config.truthy.push('oui')`); per-call settings still win over it.
 */
export interface ToBooleanConfig {
  /** Tokens recognized as true, case-insensitive */
  truthy: string[];
  /** Tokens recognized as false, case-insensitive */
  falsy: string[];
  /** Default for `loose` */
  loose: boolean;
  /** Default for `onInvalid` */
  onInvalid: OnInvalid;
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
  /** How a number reads: epoch milliseconds, or unix seconds for a JWT exp / unix timestamp (default: 'milliseconds') */
  epoch?: 'milliseconds' | 'seconds';
}

/**
 * Options for duration coercion
 */
export interface ToDurationSettings {
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
}

/**
 * The unit table read by every {@link toDuration} call. Set once at app boot
 * (e.g. `toDuration.config.units.y = 365 * 24 * 60 * 60 * 1000`), with keys matched lowercase.
 */
export interface ToDurationConfig {
  /** Milliseconds per unit, keyed by the lowercase spelling accepted after the number */
  units: Record<string, number>;
}

/**
 * Options for byte size coercion
 */
export interface ToByteSizeSettings {
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
  /** What `kb`/`mb`/`gb` scale by for this call, 1024 or 1000 (default: the config base, 1024). IEC spellings (`kib`, `mib`) are always 1024 */
  base?: number;
}

/**
 * The base and unit tables read by every {@link toByteSize} call. Set once at app boot
 * (e.g. `toByteSize.config.base = 1000` or `toByteSize.config.units.megabytes = 2`), with keys matched lowercase.
 */
export interface ToByteSizeConfig {
  /** What `units` scale by, 1024 (default) or 1000 */
  base: number;
  /** Exponent of `base` per unit, keyed by the lowercase spelling accepted after the number (`kb: 1`, `mb: 2`) */
  units: Record<string, number>;
  /** Exponent of 1024 per IEC unit (`kib: 1`, `mib: 2`), never moved by `base` */
  iecUnits: Record<string, number>;
}

/**
 * Options for bytes coercion
 */
export interface ToBytesSettings {
  /** How a failed coercion resolves (default: 'null') */
  onInvalid?: OnInvalid;
}

/** Input {@link toBytes} reads: text, a buffer, any typed array or DataView, or an array of byte values */
export type BytesLike = string | ArrayBuffer | ArrayBufferView | number[];

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
export namespace toBoolean {
  /** The global boolean vocabulary and defaults. Set once at app boot; per-call settings win over it */
  let config: ToBooleanConfig;
}

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

/** Coerces to a duration in milliseconds, returning the original value on failure. @see {@link toDuration} */
export function toDuration<T>(value: T, settings: ToDurationSettings & { onInvalid: 'passthrough'; }): number | T;
/**
 * Coerces a duration expression to milliseconds, or `null` when it reads as no duration at all.
 * Numbers are already milliseconds, and a string takes one number and one optional unit (`'5s'`, `'1.5h'`,
 * `'10 minutes'`, `'300msecs'`), case-insensitively, with an optional space between the two, reading as
 * milliseconds when the unit is left off. Milliseconds, seconds, minutes, hours, days, and weeks are
 * built in, the sign is kept, and compound forms like `'1h 30m'` return `null`. Years and months have no
 * fixed length, so they are absent until named in {@link ToDurationConfig}. `onInvalid` chooses how a
 * failed coercion resolves.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#toduration toDuration}
 * @see {@link https://next.semantic-ui.com/examples/utils-toduration Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The duration in milliseconds, or `null` if unreadable
 *
 * @example
 * ```ts
 * toDuration('5s') // 5000
 * toDuration('1.5h') // 5400000
 * toDuration('1h 30m') // null
 * setTimeout(retry, toDuration(config.retryAfter) ?? 1000)
 * ```
 */
export function toDuration(value: unknown, settings?: ToDurationSettings): number | null;
export namespace toDuration {
  /** The unit table, keyed by lowercase spelling. Set once at app boot */
  let config: ToDurationConfig;
}

/** Coerces to a byte count, returning the original value on failure. @see {@link toByteSize} */
export function toByteSize<T>(value: T, settings: ToByteSizeSettings & { onInvalid: 'passthrough'; }): number | T;
/**
 * Coerces a byte size expression to a whole number of bytes, or `null` when it reads as no size at all.
 * Numbers are already bytes, and a string takes one number and one optional unit (`'10mb'`, `'1.5 KB'`,
 * `'2 GiB'`), case-insensitively, with an optional space between the two, reading as bytes when the unit
 * is left off. `b`, `kb` through `pb` scale by `base` (1024 unless configured), the IEC `kib` through `pib`
 * are always 1024, and a byte is whole so the result rounds to the nearest one. Abbreviations only, the
 * ecosystem's `bytes()` grammar, with words and single letters one {@link ToByteSizeConfig} line away.
 * The sign is kept, bits and compound forms like `'1mb 512kb'` return `null`. `onInvalid` chooses how a
 * failed coercion resolves.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tobytesize toByteSize}
 * @see {@link https://next.semantic-ui.com/examples/utils-tobytesize Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The size in bytes, or `null` if unreadable
 *
 * @example
 * ```ts
 * toByteSize('10mb') // 10485760
 * toByteSize('10mb', { base: 1000 }) // 10000000
 * toByteSize('10mib') // 10485760 (whatever base says)
 * toByteSize('1h') // null
 * if (byteLength(body) > (toByteSize(config.maxUpload) ?? Infinity)) reject()
 * ```
 */
export function toByteSize(value: unknown, settings?: ToByteSizeSettings): number | null;
export namespace toByteSize {
  /** The base and unit tables. Set once at app boot */
  let config: ToByteSizeConfig;
}

/** Coerces to bytes, returning the original value on failure. @see {@link toBytes} */
export function toBytes<T>(value: T, settings: ToBytesSettings & { onInvalid: 'passthrough'; }): Uint8Array | T;
/**
 * Coerces a value to a `Uint8Array`, or `null` when it holds no bytes. A string reads as its UTF-8 text
 * (never as an encoding, decoding is `fromBase64`'s job), a `Uint8Array` returns as the same reference,
 * an `ArrayBuffer` or any other typed array or `DataView` becomes a view over the same memory bounded to
 * the view, and an array of integers 0..255 is copied. A bare number, an array holding a non-byte, and
 * everything else return `null`. `onInvalid` chooses how a failed coercion resolves.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/coercion#tobytes toBytes}
 * @see {@link https://next.semantic-ui.com/examples/utils-tobytes Example}
 *
 * @param value - The value to coerce
 * @param settings - Coercion options
 * @returns The bytes, or `null` if the value holds none
 *
 * @example
 * ```ts
 * toBytes('héllo') // Uint8Array [104, 195, 169, 108, 108, 111]
 * toBytes(new Float32Array([1])) // Uint8Array over the same 4 bytes
 * toBytes([1, 2, 300]) // null (300 is not a byte)
 * toBytes(5) // null (a number is not a length)
 * ```
 */
export function toBytes(value: unknown, settings?: ToBytesSettings): Uint8Array | null;

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
/** Alias of {@link toDuration} */
export const coerceDuration: typeof toDuration;
/** Alias of {@link toByteSize} */
export const coerceByteSize: typeof toByteSize;
/** Alias of {@link toBytes} */
export const coerceBytes: typeof toBytes;
/** Alias of {@link toString} */
export const coerceString: typeof toString;
