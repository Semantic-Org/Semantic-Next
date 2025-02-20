/**
 * Deep equality comparison between two values
 * Handles arrays, objects, dates, regular expressions, and primitive types
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 *
 * @example
 * ```typescript
 * isEqual([1, { a: 2 }], [1, { a: 2 }]) // → true
 * isEqual(new Date('2023'), new Date('2023')) // → true
 * ```
 */
export function isEqual(a: any, b: any): boolean;
