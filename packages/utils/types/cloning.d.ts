/**
 * Options for deep cloning
 */
export interface CloneOptions {
    /** Properties to exclude from cloning */
    exclude?: string[];
    /** Custom cloning functions for specific types */
    customClone?: Map<any, (value: any) => any>;
  }
  
  /**
   * Creates a deep clone of a value
   * Handles arrays, objects, dates, maps, sets, and primitive types
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
   * // Custom cloning
   * const customClone = new Map([
   *   [Date, (d: Date) => new Date(d.getTime())]
   * ]);
   * const clonedWithCustom = clone(obj, { customClone });
   * ```
   */
  export function clone<T>(src: T, options?: CloneOptions): T;