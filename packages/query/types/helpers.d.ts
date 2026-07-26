import { LogLevel, Query, QueryOptions, QuerySelector } from './query.js';

/**
 * Which globals `exportGlobals()` writes.
 */
export interface ExportGlobalsOptions {
  /** Export `$`. Defaults to true. */
  dollar?: boolean;
  /** Export `$$`. Defaults to true. */
  doubleDollar?: boolean;
  /** Export `Query`. Defaults to true. */
  query?: boolean;
}

/**
 * Options for `restoreGlobals()`.
 */
export interface RestoreGlobalsOptions {
  /** Also clear the global `Query`. Defaults to false. */
  removeQuery?: boolean;
}

/**
 * The main function for creating a Query instance.  This is often aliased as `$`.
 * @see {@link https://next.semantic-ui.com/docs/api/query/setup Query Setup}
 * @param selector - The selector (string, element, NodeList, etc.).
 * @param args - Optional arguments, including `root` and `pierceShadow`.
 */
declare function $(selector?: QuerySelector, args?: QueryOptions): Query;

declare namespace $ {
  /** Query's prototype. Assign to it to add a method to every collection. */
  const fn: Query;
  /** Alias for `fn`. */
  const plugin: Query;
  /** Reads and writes `Query.logLevel`. */
  let logLevel: LogLevel;
  /** Reads and writes `Query.logPerformance`. */
  let logPerformance: boolean;
}

/**
 * A function for creating a Query instance that pierces the shadow DOM by default. Often aliased as `$$`.
 * @see {@link https://next.semantic-ui.com/docs/api/query/setup Query Setup}
 * @param selector - The selector.
 * @param args - Optional arguments, including `root`.
 */
declare function $$(selector?: QuerySelector, args?: Omit<QueryOptions, 'pierceShadow'>): Query;

declare namespace $$ {
  /** Query's prototype. Assign to it to add a method to every collection. */
  const fn: Query;
  /** Alias for `fn`. */
  const plugin: Query;
  /** Reads and writes `Query.logLevel`. */
  let logLevel: LogLevel;
  /** Reads and writes `Query.logPerformance`. */
  let logPerformance: boolean;
}

/**
 * Exports the $, $$, and Query objects to the global scope (usually `window` in browsers).
 * @see {@link https://next.semantic-ui.com/docs/api/query/setup#exportglobals exportGlobals}
 * @param options - which globals to export
 */
export function exportGlobals(options?: ExportGlobalsOptions): void;

/**
 * Restores the original values of `$`, `$$`, and `Query` in the global scope, if they were overwritten by `exportGlobals`.
 * @see {@link https://next.semantic-ui.com/docs/api/query/setup#restoreglobals restoreGlobals}
 * @returns The `$` query function.
 */
export function restoreGlobals(settings?: RestoreGlobalsOptions): typeof $;

/**
 * Returns the `$` function for use under a different variable name.
 * @see {@link https://next.semantic-ui.com/docs/api/query/setup#usealias useAlias}
 * @returns The `$` query function.
 */
export function useAlias(): typeof $;

export { $, $$ };
