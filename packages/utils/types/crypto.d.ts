/**
 * Cryptographic utility functions
 * @see {@link https://next.semantic-ui.com/api/utils/crypto Crypto Utilities Documentation}
 */

/**
 * Converts a string to a URL-friendly token.
 *
 * @param {string} [str=''] The input string.
 * @returns {string} The tokenized string.
 */
export function tokenize(str?: string): string;

/**
 * Converts a number to a prettified ID string using base-36 encoding.
 *
 * @param {number} num The number to convert.
 * @returns {string} The prettified ID string.  Returns "0" if input is 0.
 */
export function prettifyID(num: number): string;

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
 * Creates a unique ID (hash code) from a string using an adapted UMASH algorithm.
 *
 * @param {string | object | null | undefined} input The input string or object. Objects are stringified using JSON.stringify.  null and undefined become "".
 * @param {HashCodeOptions} [options] Options for the hash function.
 * @returns {number} The unsigned 32-bit integer hash code.  Returns 0 on JSON serialization error.
 */
export function hashCode(input: string | object | null | undefined, options?: HashCodeOptions): number;

/**
 * Generates a random, prettified ID.
 *
 * @returns {string} A randomly generated, prettified ID.
 */
export function generateID(): string;