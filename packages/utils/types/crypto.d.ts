/**
 * Cryptographic utility functions
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto Crypto Utilities Documentation}
 */

/**
 * Converts a string to a URL-friendly token
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#tokenize tokenize}
 *
 * @param str - The input string
 * @returns The tokenized string
 *
 * @example
 * ```ts
 * tokenize('Hello World') // returns 'hello-world'
 * tokenize('A simple-test_string') // returns 'a-simple-test-string'
 * ```
 */
export function tokenize(str?: string): string;

/**
 * Options for the `prettifyHash` function.
 */
interface PrettifyHashOptions {
  /**
   * Minimum length of the output string. Will pad with padChar if necessary.
   * @default 6
   */
  minLength?: number;
  /**
   * Character to use for padding.
   * @default '0'
   */
  padChar?: string;
}

/**
 * Converts a numeric hash value to a prettified alphanumeric string using base-36 encoding
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#prettifyhash prettifyHash}
 * @see {@link https://next.semantic-ui.com/examples/utils-prettifyhash Example}
 *
 * @param numericHash - The numeric hash value to convert
 * @param options - Options for prettifying the hash
 * @returns The prettified hash string. Returns padded "0" if input parses to 0 or NaN
 *
 * @example
 * ```ts
 * prettifyHash(123) // returns '00003F'
 * prettifyHash(123, { minLength: 8 }) // returns '0000003F'
 * prettifyHash(123, { minLength: 4, padChar: 'X' }) // returns 'XX3F'
 * ```
 */
export function prettifyHash(numericHash: number, options?: PrettifyHashOptions): string;

/**
 * Options for the `hashCode` function.
 */
interface HashCodeOptions {
  /**
   * Whether to prettify the resulting hash (convert to a base-36 string).
   * @default false
   */
  prettify?: boolean;
  /**
   *  A seed value for the hash function.
   *  @default 0x12345678
   */
  seed?: number;
}

/**
 * Creates a unique ID (hash code) from a string using an adapted UMASH algorithm
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#hashcode hashCode}
 * @see {@link https://next.semantic-ui.com/examples/utils-hashcode Example}
 *
 * @param input - The input string or object. Objects are stringified using JSON.stringify. null and undefined become ""
 * @param options - Options for the hash function
 * @returns The unsigned 32-bit integer hash code, or a prettified string if prettify option is true. Returns 0 on JSON serialization error
 *
 * @example
 * ```ts
 * hashCode('test') // returns 2949673445
 * hashCode('test', { prettify: true }) // returns '29LGN5'
 * hashCode({ a: 1, b: 2 }) // returns 123456789
 * hashCode('test', { seed: 0x87654321 }) // returns 987654321
 * ```
 */
export function hashCode(input: string | object | null | undefined, options?: HashCodeOptions): number | string;

/**
 * Generates a cryptographically secure random seed value
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#getrandomseed getRandomSeed}
 * @see {@link https://next.semantic-ui.com/examples/utils-getrandomseed Example}
 *
 * @returns A random 32-bit unsigned integer. Uses crypto.getRandomValues when available, falls back to Math.random
 *
 * @example
 * ```ts
 * getRandomSeed() // returns 2949673445
 * getRandomSeed() // returns 1234567890
 * ```
 */
export function getRandomSeed(): number;

/**
 * Generates a prettified ID using a random or custom seed
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#generateid generateID}
 * @see {@link https://next.semantic-ui.com/examples/utils-generateid Example}
 *
 * @param seed - Optional seed value. If not provided, uses getRandomSeed()
 * @returns A prettified alphanumeric ID with default 6-character minimum length
 *
 * @example
 * ```ts
 * generateID() // returns 'A7B3X9'
 * generateID() // returns 'K2M8P4'
 * generateID(12345) // returns '00009IX'
 * generateID(12345) // returns '00009IX' (same seed produces same ID)
 * ```
 */
export function generateID(seed?: number): string;
