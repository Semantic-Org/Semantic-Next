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

/**
 * The elements that never take children or a close tag, per the HTML spec:
 * `area base br col embed hr img input link meta param source track wbr`
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html#voidelements voidElements}
 */
export const voidElements: Set<string>;

/**
 * The elements whose content is text and never markup, per the HTML spec:
 * `script style textarea title xmp iframe noembed noframes plaintext`
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html#rawtextelements rawTextElements}
 */
export const rawTextElements: Set<string>;

/**
 * An attribute as written on an element
 */
export interface HTMLAttribute {
  /** The name exactly as written, case and any prefix like `@click` or `:value` kept */
  name: string;
  /** The value as written with entities undecoded, `''` for `alt=""`, `null` for a valueless attribute like `disabled` */
  value: string | null;
  /** The quote character used, `''` when the value was unquoted or absent */
  quote: '"' | "'" | '';
}

/**
 * An element with its attributes and children
 */
export interface HTMLElementNode {
  type: 'element';
  /** The tag name exactly as written */
  name: string;
  /** The attributes in the order written, duplicates included */
  attributes: HTMLAttribute[];
  /** The child nodes in the order written, one text node for a raw text element, none for a void element */
  children: HTMLNode[];
  /** Whether the open tag ended with `/>` */
  selfClosing: boolean;
  /** The offset of the `<` that opens the element */
  start: number;
  /** The offset after the close tag, or after the open tag when there is none. Exclusive */
  end: number;
  /** The offset after the open tag, where the content begins */
  innerStart: number;
  /** The offset of the close tag, where the content ends. Equal to `innerStart` when there is no content */
  innerEnd: number;
}

/**
 * A run of text between tags, whitespace included, entities undecoded
 */
export interface HTMLTextNode {
  type: 'text';
  value: string;
  start: number;
  end: number;
}

/**
 * A comment, `value` being everything between `<!--` and `-->`
 */
export interface HTMLCommentNode {
  type: 'comment';
  value: string;
  start: number;
  end: number;
}

/**
 * A doctype, `value` being everything between `<!` and `>` as written, such as `'DOCTYPE html'`
 */
export interface HTMLDoctypeNode {
  type: 'doctype';
  value: string;
  start: number;
  end: number;
}

/**
 * A node of a parsed html tree. `start` and `end` are source offsets, so `html.slice(node.start, node.end)`
 * is the node exactly as written
 */
export type HTMLNode = HTMLElementNode | HTMLTextNode | HTMLCommentNode | HTMLDoctypeNode;

/**
 * Options for parseHTML function
 */
export interface ParseHTMLOptions {
  /**
   * Close a non-void element at `/>` the way template, svg and custom element authors mean it.
   * `false` reads `/>` the way a browser does, as an open tag whose content follows (default: true)
   */
  closeOnSlash?: boolean;
}

/**
 * Reads an html string, a fragment or a whole document, into plain nodes with source spans.
 * Everything stays as written: tag and attribute case, quote style, attribute order, entities,
 * whitespace and comments. A void element takes no children, a raw text element (`script`,
 * `style`, `textarea`, `title` and the rest of the spec set) holds its content as one text child,
 * and a close tag closes the nearest open element of its name. There is no browser recovery
 * beyond that: no implied `tbody`, no auto-closed `p`, no invented `html` or `body`. Malformed
 * input never throws and never loses bytes: a tag cut off by the end of the string and a close
 * tag with no open element both stay text
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html#parsehtml parseHTML}
 * @see {@link https://next.semantic-ui.com/examples/utils-parsehtml Example}
 *
 * @param html - The html to read
 * @param options - Options for how a self-closing tag reads
 * @returns The top-level nodes in order. Returns an empty array for non-string input
 *
 * @example
 * ```ts
 * parseHTML('<p class="a">Hi <b>there</b></p>')
 * // [{ type: 'element', name: 'p', attributes: [{ name: 'class', value: 'a', quote: '"' }],
 * //    children: [{ type: 'text', value: 'Hi ', start: 13, end: 16 }, { type: 'element', name: 'b', ... }],
 * //    selfClosing: false, start: 0, end: 32, innerStart: 13, innerEnd: 28 }]
 * parseHTML('<img src=a.png alt="" hidden>')[0].attributes
 * // [{ name: 'src', value: 'a.png', quote: '' }, { name: 'alt', value: '', quote: '"' }, { name: 'hidden', value: null, quote: '' }]
 * parseHTML('<script>if (a < b) {}</script>')[0].children
 * // [{ type: 'text', value: 'if (a < b) {}', start: 8, end: 21 }]
 * parseHTML('<my-el/><p>a</p>').length // 2
 * parseHTML('<div/><p>a</p>', { closeOnSlash: false })[0].children.length // 1
 * ```
 */
export function parseHTML(html: string, options?: ParseHTMLOptions): HTMLNode[];

/**
 * Writes nodes back to html. Names and values are written as stored with no escaping, attributes
 * separated by single spaces, a self-closing element as `<name />`, a void element with no close
 * tag, and every other element with a close tag respelled from its open tag. For ordinary markup
 * `stringifyHTML(parseHTML(html))` is `html` byte for byte, the whitespace inside a tag being the
 * one thing normalized. A value set by hand is written verbatim, so quoting it is the caller's
 * @see {@link https://next.semantic-ui.com/docs/api/utils/html#stringifyhtml stringifyHTML}
 * @see {@link https://next.semantic-ui.com/examples/utils-stringifyhtml Example}
 *
 * @param nodes - A node or a list of nodes
 * @returns The html. Returns an empty string for anything that is not a node or a list of nodes
 *
 * @example
 * ```ts
 * stringifyHTML(parseHTML('<a href="/x">Go</a>')) // '<a href="/x">Go</a>'
 * const nodes = parseHTML('<a href="/x">Go</a>');
 * nodes[0].attributes[0].value = '/y';
 * stringifyHTML(nodes) // '<a href="/y">Go</a>'
 * stringifyHTML({ type: 'element', name: 'br', attributes: [], children: [], selfClosing: true }) // '<br />'
 * ```
 */
export function stringifyHTML(nodes: HTMLNode | HTMLNode[]): string;
