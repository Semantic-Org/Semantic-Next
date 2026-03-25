import { Behavior, BehaviorConfig } from './behavior';
import { CSSOptions, EventHandler, EventOptions, Query, QueryOptions } from './query';

/**
 * The main function for creating a Query instance.  This is often aliased as `$`.
 * @param selector - The selector (string, element, NodeList, etc.).
 * @param args - Optional arguments, including `root` and `pierceShadow`.
 */
declare function $(
  selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy,
  args?: QueryOptions,
): Query;

/**
 * A function for creating a Query instance that pierces the shadow DOM by default. Often aliased as `$$`.
 * @param selector - The selector.
 * @param args - Optional arguments, including `root`.
 */
declare function $$(
  selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy,
  args?: Omit<QueryOptions, 'pierceShadow'>,
): Query;

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
 * Returns the `$` function for use under a different variable name.
 * @returns The `$` query function.
 */
declare function useAlias(): typeof $;

/**
 * Registers a behavior that can be called as a method on Query instances.
 * @param behavior - The behavior configuration object.
 */
declare function registerBehavior(behavior: BehaviorConfig): void;

export {
  $,
  $$,
  Behavior,
  BehaviorConfig,
  CSSOptions,
  EventHandler,
  EventOptions,
  exportGlobals,
  Query,
  QueryOptions,
  registerBehavior,
  restoreGlobals,
  useAlias,
};
