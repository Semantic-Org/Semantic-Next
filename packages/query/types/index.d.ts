import { Query } from './query';

/**
 * The main function for creating a Query instance.  This is often aliased as `$`.
 * @param selector - The selector (string, element, NodeList, etc.).
 * @param args - Optional arguments, including `root` and `pierceShadow`.
 */
declare function $(selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions): Query;

/**
 * A function for creating a Query instance that pierces the shadow DOM by default. Often aliased as `$$`.
 * @param selector - The selector.
 * @param args - Optional arguments, including `root`.
 */
declare function $$(selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: Omit<QueryOptions, 'pierceShadow'>): Query;

interface ExportGlobalsOptions {
  dollar?: boolean;
  doubleDollar?: boolean;
  query?: boolean;
}

/**
 * Exports the $, $$, and Query objects to the global scope (usually `window` in browsers).
 * @param options - which globals to export
 */
declare function exportGlobals(options?: ExportGlobalsOptions): void;

interface RestoreGlobalsOptions {
    removeQuery?: boolean;
}

/**
 * Restores the original values of `$`, `$$`, and `Query` in the global scope, if they were overwritten by `exportGlobals`.
 */
declare function restoreGlobals(settings?: RestoreGlobalsOptions): typeof $;

/**
 * Creates a Query instance with different alias function.
 */

declare function useAlias(selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions): Query;

export { Query, $, $$, exportGlobals, restoreGlobals, useAlias }; // Export Query directly
