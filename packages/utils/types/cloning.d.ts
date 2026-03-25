/**
 * Object and array cloning utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/cloning Cloning Utilities Documentation}
 */

/**
 * Options for deep cloning
 */
export interface CloneOptions {
  /** Preserve DOM nodes by reference instead of cloning them (default: false) */
  preserveDOM?: boolean;
  /** Preserve custom class instances by reference instead of flattening to plain objects (default: false) */
  preserveNonCloneable?: boolean;
}

/**
 * Creates a deep clone of a value
 * Handles arrays, objects, dates, regular expressions, maps, sets, DOM nodes, and primitive types
 * Uses WeakMap for circular reference detection and preserves null-prototype objects
 * @see {@link https://next.semantic-ui.com/docs/api/utils/cloning#clone clone}
 *
 * @param src - Value to clone
 * @param options - Cloning options
 * @returns Deep clone of the input value
 *
 * @example
 * ```ts
 * const obj = { a: [1, { b: 2 }] };
 * const cloned = clone(obj);
 *
 * // Preserve DOM nodes by reference
 * const withDOM = clone({ el: document.body }, { preserveDOM: true });
 * // withDOM.el === document.body (same reference)
 *
 * // Preserve custom class instances
 * class MyClass { value = 42; }
 * const instance = new MyClass();
 * const preserved = clone({ custom: instance }, { preserveNonCloneable: true });
 * // preserved.custom === instance (same reference)
 * ```
 */
export function clone<T>(src: T, options?: CloneOptions): T;
