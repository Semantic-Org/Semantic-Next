/**
 * Object and array cloning utilities
 * @see {@link https://next.semantic-ui.com/api/utils/cloning Cloning Utilities Documentation}
 */

/**
 * Options for deep cloning
 */
export interface CloneOptions {
  /** Preserve custom class instances instead of flattening them to plain objects */
  preserveNonCloneable?: boolean;
  /** Internal seen map for circular reference detection (do not use directly) */
  seen?: Map<any, any>;
}

/**
 * Creates a deep clone of a value
 * Handles arrays, objects, dates, maps, sets, and primitive types
 * @see {@link https://next.semantic-ui.com/api/utils/cloning#clone clone}
 *
 * @param src - Value to clone
 * @param options - Cloning options
 * @returns Deep clone of the input value
 *
 * @example
 * ```typescript
 * const obj = { a: [1, { b: 2 }] };
 * const cloned = clone(obj);
 *
 * // Preserve custom class instances
 * class MyClass { value = 42; }
 * const instance = new MyClass();
 * const preserved = clone({ custom: instance }, { preserveNonCloneable: true });
 * // preserved.custom === instance (same reference)
 * ```
 */
export function clone<T>(src: T, options?: CloneOptions): T;
