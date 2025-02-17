/**
 * Identity and hashing utilities
 */

/**
 * Options for hash code generation
 */
export interface HashCodeOptions {
  /** Convert the hash to a prettier string format */
  prettify?: boolean;
  /** Seed value for the hash function */
  seed?: number;
}

/**
 * Converts a string to a URL-friendly token
 * Removes special characters and converts spaces to dashes
 * 
 * @param str - The string to tokenize
 * @returns URL-friendly token string
 * 
 * @example
 * ```ts
 * tokenize('Hello World!') // returns 'hello-world'
 * tokenize('Some Complex & String') // returns 'some-complex-string'
 * ```
 */
export function tokenize(str?: string): string;

/**
 * Converts a number to a more readable ID string
 * Uses base-36 encoding for compact representation
 * 
 * @param num - The number to convert
 * @returns Readable ID string
 * 
 * @example
 * ```ts
 * prettifyID(1234) // returns '16I'
 * prettifyID(9999999) // returns '5K9ML'
 * ```
 */
export function prettifyID(num: number): string;

/**
 * Creates a unique hash code from input using UMASH algorithm
 * Provides good distribution and handles various input types
 * 
 * @param input - Value to hash (string, number, object, etc.)
 * @param options - Hash generation options
 * @returns Hash code (number or string if prettified)
 * 
 * @example
 * ```ts
 * hashCode('test') // returns a number
 * hashCode({ a: 1,
