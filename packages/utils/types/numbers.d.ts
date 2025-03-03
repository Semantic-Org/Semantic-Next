/**
 * Number manipulation and formatting utilities
 * @see {@link https://next.semantic-ui.com/api/utils/numbers Number Utilities Documentation}
 */

/**
 * Rounds a number to a specified number of significant digits.
 * Handles very large and very small numbers correctly.
 * Returns the original value if it's not a finite number.
 * 
 * @param number - The number to round
 * @param digits - Number of significant digits (default: 5)
 * @returns The rounded number
 * 
 * @example
 * ```ts
 * roundNumber(123.456789, 4) // returns 123.5
 * roundNumber(0.00123456789, 3) // returns 0.00123
 * roundNumber(123456789, 3) // returns 123000000
 * roundNumber(Infinity) // returns Infinity
 * ```
 */
export function roundNumber(number: number, digits?: number): number;
