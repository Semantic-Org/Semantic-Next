/**
 * Regular expression utility functions
 * @see {@link https://next.semantic-ui.com/docs/api/utils/regex Regular Expression Utilities Documentation}
 */

/**
 * Escapes special characters in a string for use in a regular expression
 * Escapes: . * + ? ^ $ { } ( ) | [ ] / \
 * @see {@link https://next.semantic-ui.com/docs/api/utils/regex#escaperegexp escapeRegExp}
 *
 * @param string - The string to escape
 * @returns The escaped string safe for use in RegExp
 *
 * @example
 * ```ts
 * escapeRegExp('hello.world') // returns 'hello\.world'
 * escapeRegExp('(test)') // returns '\(test\)'
 * new RegExp(escapeRegExp('.*+?^${}()|[]\\')) // creates valid regex
 * ```
 */
export function escapeRegExp(string: string): string;
