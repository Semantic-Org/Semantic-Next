/**
 * Array and object iteration utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/looping Looping Utilities Documentation}
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
 * Iterates over a collection (array, object, Set, or Map), calling the iteratee for each element.
 * Returns false from the iteratee to break the iteration early.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/looping#each each}
 *
 * @param obj - Collection to iterate over (Array, Object, Set, or Map)
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
 *
 * // Set iteration
 * each(new Set([1, 2, 3]), (value, index) => {
 *   console.log(value); // index is 0, 1, 2...
 * });
 *
 * // Map iteration
 * each(new Map([['a', 1], ['b', 2]]), (value, key) => {
 *   console.log(key, value); // key is 'a', 'b'; value is 1, 2
 * });
 * ```
 */
export function each<T>(
  obj: T[],
  func: IterationCallback<T, number>,
  context?: any,
): T[];
export function each<T>(
  obj: Set<T>,
  func: IterationCallback<T, number>,
  context?: any,
): Set<T>;
export function each<K, V>(
  obj: Map<K, V>,
  func: IterationCallback<V, K>,
  context?: any,
): Map<K, V>;
export function each<T extends object>(
  obj: T,
  func: IterationCallback<T[keyof T], keyof T>,
  context?: any,
): T;

/**
 * Asynchronously iterates over a collection (Array, Object, Set, or Map)
 * Supports breaking early by returning false from the iteratee
 * @see {@link https://next.semantic-ui.com/docs/api/utils/looping#asynceach asyncEach}
 *
 * @param obj - Collection to iterate over (Array, Object, Set, or Map)
 * @param func - Async function to execute for each element
 * @param context - Optional this context
 *
 * @example
 * ```typescript
 * // Async Set iteration
 * await asyncEach(new Set([1, 2, 3]), async (value, index) => {
 *   await processValue(value);
 * });
 *
 * // Async Map iteration
 * await asyncEach(new Map([['a', 1], ['b', 2]]), async (value, key) => {
 *   await processEntry(key, value);
 * });
 * ```
 */
export function asyncEach<T>(
  obj: T[],
  func: (value: T, index: number, array: T[]) => Promise<boolean | void>,
  context?: any,
): Promise<T[]>;
export function asyncEach<T>(
  obj: Set<T>,
  func: (value: T, index: number, set: Set<T>) => Promise<boolean | void>,
  context?: any,
): Promise<Set<T>>;
export function asyncEach<K, V>(
  obj: Map<K, V>,
  func: (value: V, key: K, map: Map<K, V>) => Promise<boolean | void>,
  context?: any,
): Promise<Map<K, V>>;
export function asyncEach<T extends object>(
  obj: T,
  func: (value: T[keyof T], key: keyof T, obj: T) => Promise<boolean | void>,
  context?: any,
): Promise<T>;

/**
 * Maps over a collection asynchronously, creating a new collection of mapped values.
 * Awaits each iteratee call and collects the results.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/looping#asyncmap asyncMap}
 *
 * @param obj - Collection to map over (Array, Object, Set, or Map)
 * @param func - Async mapping function for each element
 * @param context - Optional this context
 * @returns Promise resolving to the mapped collection
 *
 * @example
 * ```typescript
 * // Async Set mapping returns array
 * const result = await asyncMap(new Set([1, 2, 3]), async (value) => {
 *   return await processValue(value);
 * }); // returns Promise<number[]>
 *
 * // Async Map mapping returns new Map with same keys
 * const result = await asyncMap(new Map([['a', 1], ['b', 2]]), async (value, key) => {
 *   return await transform(value);
 * }); // returns Promise<Map<string, TransformedType>>
 * ```
 */
export function asyncMap<T, U>(
  obj: T[],
  func: (value: T, index: number, array: T[]) => Promise<U>,
  context?: any,
): Promise<U[]>;
export function asyncMap<T, U>(
  obj: Set<T>,
  func: (value: T, index: number, set: Set<T>) => Promise<U>,
  context?: any,
): Promise<U[]>;
export function asyncMap<K, V, U>(
  obj: Map<K, V>,
  func: (value: V, key: K, map: Map<K, V>) => Promise<U>,
  context?: any,
): Promise<Map<K, U>>;
export function asyncMap<T extends object, U>(
  obj: T,
  func: (value: T[keyof T], key: keyof T, obj: T) => Promise<U>,
  context?: any,
): Promise<{ [K in keyof T]: U; }>;
