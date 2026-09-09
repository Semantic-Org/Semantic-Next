/**
 * Adds vendor prefixes to the CSS properties that still require them in modern
 * browsers, emitting the prefixed declaration above the original so the
 * unprefixed standard wins where supported. Matching is line-based, so a
 * declaration must sit on its own line. A declaration already written with a
 * vendor prefix is left alone, and CSS with nothing prefixable is returned
 * unchanged. The rule list shrinks over time as browsers adopt the standards.
 *
 * @param css - The CSS string to prefix
 * @returns The CSS with vendor-prefixed declarations inserted
 *
 * @example
 * ```ts
 * prefixCSS('.a {\n  user-select: none;\n}')
 * // '.a {\n  -webkit-user-select: none;\n  user-select: none;\n}'
 * ```
 */
export function prefixCSS(css: string): string;

/**
 * A declaration inside a rule or an at-rule block
 */
export interface CSSDeclarationNode {
  type: 'declaration';
  /** The property as written, so a custom property keeps its case */
  property: string;
  /** The value as written, trimmed, without a trailing `!important` */
  value: string;
  /** Whether `!important` was written on the declaration */
  important: boolean;
}

/**
 * A style rule: its selector list and its children in source order
 */
export interface CSSRuleNode {
  type: 'rule';
  /** The selector list split on top-level commas, each selector as written */
  selectors: string[];
  /** Declarations, nested rules and nested at-rules in the order written */
  children: CSSChildNode[];
}

/**
 * An at-rule. A block at-rule (`@media`, `@layer name`, `@font-face`, `@keyframes`)
 * carries children, a statement (`@import`, `@layer a, b;`) has none
 */
export interface CSSAtRuleNode {
  type: 'at-rule';
  /** The name without the `@` */
  name: string;
  /** The text between the name and the block or the `;`, `''` when there is none */
  prelude: string;
  /** Declarations and rules in the order written, absent on a statement */
  children?: CSSChildNode[];
}

/**
 * A node at the top of a stylesheet or inside an at-rule block
 */
export type CSSNode = CSSRuleNode | CSSAtRuleNode;

/**
 * Anything a rule or an at-rule block holds
 */
export type CSSChildNode = CSSNode | CSSDeclarationNode;

/**
 * A selector's specificity, compared left to right
 */
export type CSSSpecificity = [ids: number, classes: number, elements: number];

/**
 * Options for parseCSS function
 */
export interface ParseCSSOptions {
  /**
   * Flatten nesting the way a preprocessor writes it: `&` becomes the parent selector, a nested
   * selector without `&` a descendant, a selector list times a list multiplies out, and an at-rule
   * nested in a rule lifts out with the rule rebuilt inside it. Rules keep their declarations and
   * their written order (default: false)
   */
  flatten?: boolean;
}

/**
 * Options for stringifyCSS function
 */
export interface StringifyCSSOptions {
  /** The indentation per nesting level (default: two spaces) */
  indent?: string;
}

/**
 * Reads a stylesheet into plain nodes with nesting kept as written, on the server as
 * in a browser. Comments are dropped, `!important` is read off each declaration, custom properties
 * read like any other declaration, and every at-rule reads as a node. Malformed input
 * never throws: the sheet reads as far as it parses, the way a browser recovers
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#parsecss parseCSS}
 * @see {@link https://next.semantic-ui.com/examples/utils-parsecss Example}
 *
 * @param css - The CSS text to read
 * @param options - Options for the shape of the tree
 * @returns The stylesheet's top-level rules and at-rules
 *
 * @example
 * ```ts
 * parseCSS('.a { color: red; &:hover { color: blue } }')
 * // [{ type: 'rule', selectors: ['.a'], children: [
 * //   { type: 'declaration', property: 'color', value: 'red', important: false },
 * //   { type: 'rule', selectors: ['&:hover'], children: [...] },
 * // ] }]
 * parseCSS(css, { flatten: true }) // '.a:hover' as its own rule
 * parseCSS('@import url("x.css");') // [{ type: 'at-rule', name: 'import', prelude: 'url("x.css")' }]
 * ```
 */
export function parseCSS(css: string, options?: ParseCSSOptions): CSSNode[];

/**
 * Writes a tree of nodes back to CSS text in one canonical layout, with one declaration
 * per line and nested blocks indented per level. `parseCSS(stringifyCSS(nodes))` reads
 * back as the same tree
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#stringifycss stringifyCSS}
 * @see {@link https://next.semantic-ui.com/examples/utils-stringifycss Example}
 *
 * @param nodes - The nodes to write, as parseCSS returns them or built by hand
 * @param options - Options for the layout
 * @returns The CSS text, with no trailing newline
 *
 * @example
 * ```ts
 * stringifyCSS(parseCSS('.a{color:red}')) // '.a {\n  color: red;\n}'
 * stringifyCSS(nodes, { indent: '\t' })
 * ```
 */
export function stringifyCSS(nodes: CSSNode[], options?: StringifyCSSOptions): string;

/**
 * The specificity of one selector as `[ids, classes, elements]`, following Selectors
 * Level 4: `:is()`, `:not()` and `:has()` count their most specific argument, `:where()`
 * counts nothing, `:host()` and `::slotted()` add their argument. A selector list is not
 * one selector, so pass each selector on its own
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#selectorspecificity selectorSpecificity}
 * @see {@link https://next.semantic-ui.com/examples/utils-selectorspecificity Example}
 *
 * @param selector - One selector
 * @returns The specificity, `[0, 0, 0]` for an empty selector
 *
 * @example
 * ```ts
 * selectorSpecificity('#nav .item a:hover') // [1, 2, 1]
 * selectorSpecificity(':is(#a, .b) span')   // [1, 0, 1]
 * selectorSpecificity(':where(.reset) *')   // [0, 0, 0]
 * ```
 */
export function selectorSpecificity(selector: string): CSSSpecificity;

/**
 * Options for adoptStylesheet function
 */
export interface AdoptStylesheetOptions {
  /** Hash value for the CSS content (auto-generated if not provided) */
  hash?: string | number;
  /** Whether to cache the stylesheet globally for reuse (default: true) */
  cacheStylesheet?: boolean;
}

/**
 * Options for scopeStyles function
 */
export interface ScopeStylesOptions {
  /** Replace :host selectors with the scope selector instead of prepending (default: false) */
  replaceHost?: boolean;
  /** Append scope to html/body selectors instead of prepending (default: true) */
  appendToRootElements?: boolean;
}

/**
 * Adopts a CSS stylesheet to a document or shadow root with caching support
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#adoptstylesheet adoptStylesheet}
 * @see {@link https://next.semantic-ui.com/examples/utils-adoptstylesheet Example}
 *
 * @param css - The CSS string to adopt
 * @param adoptedElement - The document or shadow root to adopt the stylesheet to (defaults to document). An element resolves to its root node
 * @param options - Options for stylesheet adoption and caching
 * @returns void
 *
 * @example
 * ```ts
 * adoptStylesheet('.button { color: blue; }')
 * adoptStylesheet('.scoped { margin: 10px; }', shadowRoot)
 * adoptStylesheet('.scoped { margin: 10px; }', element) // adopts into the element's root
 * adoptStylesheet(css, document, { cacheStylesheet: false })
 * ```
 */
export function adoptStylesheet(
  css: string,
  adoptedElement?: Document | ShadowRoot | Element,
  options?: AdoptStylesheetOptions,
): void;

/**
 * Options for extractCSS function
 */
export interface ExtractCSSOptions {
  /** Return CSS text instead of CSSStyleSheet object (default: false) */
  returnText?: boolean;
  /** Require exact selector matching (default: false, allows substring matching) */
  exactMatch?: boolean;
}

/**
 * The stylesheet sources {@link extractCSS} accepts: raw CSS text, a document, a
 * single stylesheet, an array of stylesheets, or any host exposing `styleSheets`
 * or `adoptedStyleSheets`.
 */
export type ExtractCSSSource =
  | string
  | Document
  | CSSStyleSheet
  | CSSStyleSheet[]
  | { styleSheets: StyleSheetList; }
  | { adoptedStyleSheets: CSSStyleSheet[]; };

/**
 * Extracts CSS rules matching a selector, returning them as CSS text
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#extractcss extractCSS}
 */
export function extractCSS(
  selector: string,
  source: ExtractCSSSource | undefined,
  options: ExtractCSSOptions & { returnText: true; },
): string;
/**
 * Extracts CSS rules matching a selector from various stylesheet sources
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#extractcss extractCSS}
 * @see {@link https://next.semantic-ui.com/examples/utils-extractcss Example}
 *
 * @param selector - The CSS selector to match (case-insensitive)
 * @param source - The source to extract from: CSS string, document, stylesheet, or array of stylesheets
 * @param options - Options for extraction behavior
 * @returns A new CSSStyleSheet containing matching rules, or CSS text if returnText is true
 *
 * @example
 * ```ts
 * extractCSS('.button') // extract from document stylesheets
 * extractCSS('.component', cssString) // extract from CSS string
 * extractCSS('.widget', [stylesheet1, stylesheet2]) // extract from stylesheet array
 * extractCSS('.button', css, { returnText: true }) // return as CSS text
 * extractCSS('.btn', css, { exactMatch: true }) // exact match only
 * ```
 */
export function extractCSS(
  selector: string,
  source?: ExtractCSSSource,
  options?: ExtractCSSOptions & { returnText?: false; },
): CSSStyleSheet;
/**
 * Extracts CSS rules matching a selector, returning a stylesheet or CSS text
 * depending on `returnText`
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#extractcss extractCSS}
 */
export function extractCSS(
  selector: string,
  source?: ExtractCSSSource,
  options?: ExtractCSSOptions,
): CSSStyleSheet | string;

/**
 * Scopes a stylesheet under a selector, with no DOM needed. Every selector in a
 * top-level rule and in the rules inside `@media`, `@supports`, `@layer` and
 * `@container` blocks gains the scope, nested rules stay under their scoped parent,
 * and keyframe selectors are left alone. The output is written in the canonical
 * layout of `stringifyCSS`
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#scopestyles scopeStyles}
 * @see {@link https://next.semantic-ui.com/examples/utils-scopestyles Example}
 *
 * @param css - The CSS string to scope
 * @param scopeSelector - The selector to scope under, kept as written
 * @param options - Options for scoping behavior
 * @returns The scoped CSS string
 *
 * @example
 * ```ts
 * scopeStyles('.button { color: red; }', '.my-component')
 * scopeStyles(':host { display: block; }', '.widget', { replaceHost: true })
 * scopeStyles('html { font-size: 16px; }', '.app', { appendToRootElements: false })
 * ```
 */
export function scopeStyles(
  css: string,
  scopeSelector?: string,
  options?: ScopeStylesOptions,
): string;
