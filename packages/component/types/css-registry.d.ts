export interface RegisterCSSOptions {
  /** Whether to adopt this stylesheet into all component shadow roots by default. */
  default?: boolean;
}

export type BaseCSSEntry = string | CSSStyleSheet | Record<string, string> | false;
export type BaseCSSValue = BaseCSSEntry | BaseCSSEntry[];

/**
 * Registers one or more named stylesheets for reuse across components via `baseCSS`.
 */
export function registerCSS(name: string, css: string, options?: RegisterCSSOptions): void;
export function registerCSS(sheets: Record<string, string>, options?: RegisterCSSOptions): void;

/**
 * Looks up a registered stylesheet by name.
 */
export function getCSS(name: string): string | undefined;

/**
 * Whether a stylesheet is registered under the given name.
 */
export function hasCSS(name: string): boolean;
