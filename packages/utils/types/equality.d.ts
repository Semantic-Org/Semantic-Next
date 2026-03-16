/**
 * Deep equality comparison utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/equality Equality Utilities Documentation}
 */

/**
 * Options for deep equality comparison
 */
export interface IsEqualOptions {
  /** Use loose equality (==) for leaf value comparison (default: false) */
  loose?: boolean;
  /** Array of property names to skip during comparison */
  ignoreKeys?: string[];
  /** Check if a is a structural subset of b (default: false) */
  partial?: boolean;
}

/**
 * Deep structural equality comparison between two values
 * Handles arrays, objects, dates, regular expressions, maps, sets, typed arrays, and primitive types
 * Uses prototype comparison for objects, making it safe with Object.create(null)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/equality#isequal isEqual}
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @returns True if values are deeply equal
 *
 * @example
 * ```ts
 * isEqual([1, { a: 2 }], [1, { a: 2 }]) // true
 * isEqual(new Date('2023'), new Date('2023')) // true
 * isEqual('1', 1, { loose: true }) // true
 * isEqual({ a: 1 }, { a: 1, b: 2 }, { partial: true }) // true
 * isEqual({ a: 1, meta: 'x' }, { a: 1, meta: 'y' }, { ignoreKeys: ['meta'] }) // true
 * ```
 */
export function isEqual(a: any, b: any, options?: IsEqualOptions): boolean;
