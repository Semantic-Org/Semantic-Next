/**
 * Number manipulation and formatting utilities
 * @see {@link https://next.semantic-ui.com/api/utils/numbers Number Utilities Documentation}
 */

/**
 * Rounds a number to a specified number of significant digits.
 * Handles very large and very small numbers correctly.
 * Returns the original value if it's not a finite number.
 * @see {@link https://next.semantic-ui.com/api/utils/numbers#roundnumber roundNumber}
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

/**
 * Rounds a number to a specified number of decimals.
 * Handles very large and very small numbers correctly.
 * Returns the original value if it's not a finite number.
 * @see {@link https://next.semantic-ui.com/api/utils/numbers#decimals decimals}
 *
 * @param number - The number to round
 * @param digits - Number of decimals (default: 2)
 * @returns The rounded number
 *
 * @example
 * ```ts
 * roundDecimal(123.456789) // returns 123.45
 * roundDecimal(0.00123456789, 3) // returns 0.001
 * roundDecimal(123, 3) // returns 123.000
 * roundDecimal(Infinity) // returns Infinity
 * ```
 */
export function roundDecimal(number: number, digits?: number): number;
