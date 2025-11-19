/**
 * HTML and text formatting utility functions
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html HTML Utilities Documentation}
 */

/**
 * Adds consistent indentation to every line of text
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html#indentlines indentLines}
 * @see {@link https://next.semantic-ui.com/examples/utils-indentlines Example}
 *
 * @param text - The text to indent
 * @param spaces - Number of spaces to indent each line
 * @returns The indented text. Returns empty string for non-string input
 *
 * @example
 * ```ts
 * indentLines('line 1\nline 2', 2) // returns '  line 1\n  line 2'
 * indentLines('line 1\nline 2', 4) // returns '    line 1\n    line 2'
 * indentLines('code', 0) // returns 'code'
 * ```
 */
export function indentLines(text: string, spaces?: number): string;

/**
 * Options for the `indentHTML` function.
 */
interface IndentHTMLOptions {
  /**
   * String to use for each level of indentation.
   * @default '  ' (two spaces)
   */
  indent?: string;
  /**
   * Initial nesting level to start indentation from.
   * @default 0
   */
  startLevel?: number;
  /**
   * Whether to remove empty lines from the output.
   * @default true
   */
  trimEmptyLines?: boolean;
}

/**
 * Intelligently indents HTML markup with proper nesting
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html#indenthtml indentHTML}
 * @see {@link https://next.semantic-ui.com/examples/utils-indenthtml Example}
 *
 * @param html - The HTML string to indent
 * @param options - Options for indentation behavior
 * @returns The properly indented HTML. Returns empty string for non-string input
 *
 * @example
 * ```ts
 * indentHTML('<div>\n<p>Content</p>\n</div>')
 * // returns '<div>\n  <p>Content</p>\n</div>'
 *
 * indentHTML('<div>\n<p>Content</p>\n</div>', { indent: '\t' })
 * // returns '<div>\n\t<p>Content</p>\n</div>'
 *
 * indentHTML('<div>\n<p>Content</p>\n</div>', { startLevel: 1 })
 * // returns '  <div>\n    <p>Content</p>\n  </div>'
 *
 * indentHTML('<div>\n<img src="test.jpg">\n<br>\n</div>')
 * // returns '<div>\n  <img src="test.jpg">\n  <br>\n</div>'
 * ```
 */
export function indentHTML(html: string, options?: IndentHTMLOptions): string;
