/**
 * Regular expression utility functions
 * @see {@link https://next.semantic-ui.com/api/utils/regex Regular Expression Utilities Documentation}
 */

/**
 * Escapes special characters in a string for use in a regular expression
 * Escapes: . * + ? ^ $ { } ( ) | [ ] / \
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

/**
 * Escapes HTML special characters in a string
 * Escapes: & < > " '
 * 
 * @param string - The string to escape
 * @returns The string with HTML special characters escaped
 * 
 * @example
 * ```ts
 * escapeHTML('<div>Hello & "World"</div>')
 * // returns '&ltdiv&gtHello &amp &quotWorld&quot&lt/div&gt'
 * ```
 */
export function escapeHTML(string: string): string;
