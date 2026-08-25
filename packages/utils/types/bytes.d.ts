/**
 * Byte measurement, formatting, and encoding utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes Bytes Utilities Documentation}
 */

import type { BytesLike } from './coercion.js';

/**
 * Options for byte size formatting
 */
export interface FormatByteSizeSettings {
  /** What the units scale by, 1024 or 1000 (default: the config base, 1024) */
  base?: number;
  /** Maximum decimal places, trailing zeros drop (default: the config decimals, 1) */
  decimals?: number;
  /** Hold one unit instead of picking the largest the value fills, any spelling `toByteSize` reads (`'mb'`, `'KB'`, `'mib'`) */
  unit?: string;
  /** Print the IEC labels (`KiB`, `MiB`), which pins `base` to 1024 (default: the config iec, false) */
  iec?: boolean;
  /** Format the number for a locale (`'de-DE'` prints `1,5 KB`) instead of plain digits */
  locale?: string | string[];
}

/**
 * The defaults and labels read by every {@link formatByteSize} call. Set once at app boot
 * (e.g. `formatByteSize.config.labels[1] = 'kB'`); per-call settings still win over it.
 */
export interface FormatByteSizeConfig {
  /** Default for `base` */
  base: number;
  /** Default for `decimals` */
  decimals: number;
  /** Default for `iec` */
  iec: boolean;
  /** Labels by exponent, bytes first (`['B', 'KB', 'MB', 'GB', 'TB', 'PB']`) */
  labels: string[];
  /** IEC labels by exponent, bytes first (`['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']`) */
  iecLabels: string[];
}

/**
 * The number of bytes a value holds, or `null` when it holds none. A string counts its UTF-8 bytes (not
 * its characters), binary input counts by its view, and an array of byte values by its length.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes#bytelength byteLength}
 * @see {@link https://next.semantic-ui.com/examples/utils-bytelength Example}
 *
 * @param value - The value to measure
 * @returns The byte count, or `null` if the value holds no bytes
 *
 * @example
 * ```ts
 * byteLength('héllo') // 6 (5 characters)
 * byteLength(new Float32Array(2)) // 8
 * byteLength({}) // null
 * ```
 */
export function byteLength(value: unknown): number | null;

/**
 * Formats a byte count for display, picking the largest unit the value fills (`'1.5 KB'`, `'10 MB'`), or
 * `null` when there is no size to format. Accepts anything {@link toByteSize} reads, at the same base.
 * `decimals` is a maximum and trailing zeros drop, `unit` holds one unit for a column, `iec` prints
 * `KiB`/`MiB` at 1024, and `locale` formats the number for a locale. The sign is kept.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes#formatbytesize formatByteSize}
 * @see {@link https://next.semantic-ui.com/examples/utils-formatbytesize Example}
 *
 * @param value - The byte count, or a size expression
 * @param settings - Formatting options
 * @returns The formatted size, or `null` if there is no size to format
 *
 * @example
 * ```ts
 * formatByteSize(1536) // '1.5 KB'
 * formatByteSize(10485760, { iec: true }) // '10 MiB'
 * formatByteSize(1536, { unit: 'mb', decimals: 3 }) // '0.001 MB'
 * formatByteSize('10mb') // '10 MB'
 * ```
 */
export function formatByteSize(value: unknown, settings?: FormatByteSizeSettings): string | null;
export namespace formatByteSize {
  /** The defaults and labels. Set once at app boot; per-call settings win over it */
  let config: FormatByteSizeConfig;
}

/**
 * Options for base64 encoding
 */
export interface ToBase64Settings {
  /** Emit the URL-safe alphabet (`-`/`_`, no padding) instead of standard base64 (default: false) */
  urlSafe?: boolean;
}

/**
 * Options for base64 decoding
 */
export interface FromBase64Settings {
  /** Decode to a UTF-8 string or the raw bytes (default: 'string') */
  as?: 'string' | 'bytes';
}

/**
 * Encodes a string or binary data to a base64 string. Unicode-safe — a string is encoded as its UTF-8
 * bytes, so `btoa`'s Latin1-only limit never bites. Accepts anything {@link toBytes} reads: a string,
 * `ArrayBuffer`, typed array, or array of byte values. Input outside those returns `null` rather than
 * encoding garbage.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes#tobase64 toBase64}
 * @see {@link https://next.semantic-ui.com/examples/utils-tobase64 Example}
 *
 * @param input - The string or binary data to encode
 * @param settings - Encoding options
 * @returns The base64 string
 *
 * @example
 * ```ts
 * toBase64('héllo') // 'aMOpbGxv'
 * toBase64('a?b>c', { urlSafe: true }) // URL-safe, no padding
 * toBase64(new Uint8Array([1, 2, 3])) // 'AQID'
 * ```
 */
export function toBase64(input: BytesLike, settings?: ToBase64Settings): string;
export function toBase64(input: unknown, settings?: ToBase64Settings): string | null;

/**
 * Decodes a base64 string to a UTF-8 string or raw bytes, or `null` when the input is not a string or
 * not decodable base64 — it never throws. Accepts both the standard and URL-safe alphabets, tolerates
 * missing padding, and strips whitespace (MIME/PEM line wrapping).
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes#frombase64 fromBase64}
 * @see {@link https://next.semantic-ui.com/examples/utils-frombase64 Example}
 *
 * @param base64 - The base64 string to decode
 * @param settings - Decoding options
 * @returns The decoded UTF-8 string, or a `Uint8Array` when `as` is `'bytes'`, or `null` if undecodable
 *
 * @example
 * ```ts
 * fromBase64('aMOpbGxv') // 'héllo'
 * fromBase64('AQID', { as: 'bytes' }) // Uint8Array [1, 2, 3]
 * fromBase64('!!!') // null (never throws)
 * ```
 */
export function fromBase64(base64: string, settings: { as: 'bytes'; }): Uint8Array | null;
export function fromBase64(base64: string, settings?: { as?: 'string'; }): string | null;
export function fromBase64(base64: unknown, settings?: FromBase64Settings): string | Uint8Array | null;
