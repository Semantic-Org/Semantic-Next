/**
 * Array and object iteration utilities
 * @see {@link https://next.semantic-ui.com/api/utils/looping Looping Utilities Documentation}
 */

/**
 * Collection utilities for iterating and manipulating arrays and objects
 */

/**
 * Callback for collection iteration functions
 */
export interface IterationCallback<TValue, TKey = number | string> {
  /**
   * @param value - Current value being processed
   * @param key - Key/index of current value
   * @param collection - The collection being processed
   * @returns False to break iteration, void to continue
   */
  (value: TValue, key: TKey, collection: any): boolean | void;
}


/**
 * Iterates over a collection (array or object), calling the iteratee for each element.
 * Returns false from the iteratee to break the iteration early.
 *
 * @param obj - Collection to iterate over
 * @param func - Function to execute for each element
 * @param context - Optional this context for the iteratee
 * @returns The original collection
 *
 * @example
 * ```typescript
 * // Array iteration
 * each([1, 2, 3], (value, index) => {
 *   console.log(value);
 *   if (value === 2) return false; // break iteration
 * });
 *
 * // Object iteration
 * each({ a: 1, b: 2 }, (value, key) => {
 *   console.log(key, value);
 * });
 * ```
 */
export function each<T>(
  obj: T[],
  func: IterationCallback<T, number>,
  context?: any
): T[];
export function each<T extends object>(
  obj: T,
  func: IterationCallback<T[keyof T], keyof T>,
  context?: any
): T;

/**
 * Asynchronously iterates over a collection
 * Supports breaking early by returning false from the iteratee
 *
 * @param obj - Collection to iterate over
 * @param func - Async function to execute for each element
 * @param context - Optional this context
 */
export function asyncEach<T>(
  obj: T[],
  func: (value: T, index: number, array: T[]) => Promise<boolean | void>,
  context?: any
): Promise<T[]>;
export function asyncEach<T extends object>(
  obj: T,
  func: (value: T[keyof T], key: keyof T, obj: T) => Promise<boolean | void>,
  context?: any
): Promise<T>;

/**
 * Maps over a collection asynchronously, creating a new collection of mapped values.
 * Awaits each iteratee call and collects the results.
 *
 * @param obj - Collection to map over
 * @param func - Async mapping function for each element
 * @param context - Optional this context
 * @returns Promise resolving to the mapped collection
 */
export function asyncMap<T, U>(
  obj: T[],
  func: (value: T, index: number, array: T[]) => Promise<U>,
  context?: any
): Promise<U[]>;
export function asyncMap<T extends object, U>(
  obj: T,
  func: (value: T[keyof T], key: keyof T, obj: T) => Promise<U>,
  context?: any
): Promise<{ [K in keyof T]: U }>;
