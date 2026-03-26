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
 * @param adoptedElement - The document or shadow root to adopt the stylesheet to (defaults to document)
 * @param options - Options for stylesheet adoption and caching
 * @returns void
 *
 * @example
 * ```ts
 * adoptStylesheet('.button { color: blue; }')
 * adoptStylesheet('.scoped { margin: 10px; }', shadowRoot)
 * adoptStylesheet(css, document, { cacheStylesheet: false })
 * ```
 */
export function adoptStylesheet(
  css: string,
  adoptedElement?: Document | ShadowRoot,
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
  source?: string | Document | CSSStyleSheet | CSSStyleSheet[] | { styleSheets: StyleSheetList; } | {
    adoptedStyleSheets: CSSStyleSheet[];
  },
  options?: ExtractCSSOptions,
): CSSStyleSheet | string;

/**
 * Scopes CSS rules by prepending a selector to all rules with configurable options
 * @see {@link https://next.semantic-ui.com/docs/api/utils/css#scopestyles scopeStyles}
 * @see {@link https://next.semantic-ui.com/examples/utils-scopestyles Example}
 *
 * @param css - The CSS string to scope
 * @param scopeSelector - The selector to use for scoping (case-insensitive)
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
