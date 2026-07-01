/**
 * Byte encoding utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes Bytes Utilities Documentation}
 */

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
 * bytes, so `btoa`'s Latin1-only limit never bites. Accepts a string, `ArrayBuffer`, or any typed array.
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
export function toBase64(input: string | ArrayBuffer | ArrayBufferView | number[], settings?: ToBase64Settings): string;

/**
 * Decodes a base64 string to a UTF-8 string or raw bytes. Accepts both the standard and URL-safe
 * alphabets and tolerates missing padding.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/bytes#frombase64 fromBase64}
 * @see {@link https://next.semantic-ui.com/examples/utils-frombase64 Example}
 *
 * @param base64 - The base64 string to decode
 * @param settings - Decoding options
 * @returns The decoded UTF-8 string, or a `Uint8Array` when `as` is `'bytes'`
 *
 * @example
 * ```ts
 * fromBase64('aMOpbGxv') // 'héllo'
 * fromBase64('AQID', { as: 'bytes' }) // Uint8Array [1, 2, 3]
 * ```
 */
export function fromBase64(base64: string, settings: { as: 'bytes'; }): Uint8Array;
export function fromBase64(base64?: string, settings?: { as?: 'string'; }): string;
