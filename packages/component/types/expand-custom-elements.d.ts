import { renderToString } from './render-to-string.js';

/**
 * Options for {@link expandCustomElements}.
 */
export interface ExpandCustomElementsOptions {
  /** Current nesting depth. Recursion stops at 10 to guard against cycles. */
  depth?: number;
  /** Whether the expanded output should hydrate on the client. */
  hydrate?: boolean;
  /**
   * Renderer used for each registered element found in the HTML.
   * Pass {@link renderToString}; the indirection is what keeps the two modules
   * free of a circular import. Without it nothing is expanded.
   */
  renderFn?: typeof renderToString;
}

/**
 * Scans rendered HTML for custom element tags, looks each one up in the
 * component registry, and renders its shadow DOM inline as declarative shadow DOM.
 *
 * Unregistered tags and elements that already carry a `<template shadowrootmode>`
 * pass through untouched.
 *
 * @example
 * expandCustomElements('<div><ui-icon icon="home"></ui-icon></div>', { renderFn: renderToString });
 */
export function expandCustomElements(html: string, options?: ExpandCustomElementsOptions): string;
