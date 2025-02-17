/**
 * Collection utilities for iterating and manipulating arrays and objects
 */

/**
 * Callback for collection iteration functions
 */
export interface IterationCallback<T, K = number | string> {
  /**
   * @param value - Current value being processed
   * @param key - Key/index of current value
   * @param collection - The collection being processed
   * @returns Optionally return false to break iteration
   */
  (value: T, key: K, collection: any): boolean | void;
}

/**
 * Iterates over a collection (array or object), calling the iteratee for each element
 * Returns false from the iteratee to break the iteration early
 * 
 * @param obj - Collection to iterate over
 * @param func - Function to execute for each element
 * @param context - Optional this context for the iteratee
 * @returns The original collection
 * 
 * @example
 * ```ts
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
 * Asynchronous version of each()
 * Iterates over a collection, awaiting the iteratee for each element
 * Returns false from the iteratee to break the iteration early
 * 
 * @param obj - Collection to iterate over
 * @param func - Async function to execute for each element
 * @param context - Optional this context for the iteratee
 * @returns Promise that resolves to the original collection
 * 
 * @example
 * ```ts
 * await asyncEach([1, 2, 3], async (value) => {
 *   await someAsyncOperation(value);
 * });
 * 
 * await asyncEach({ a: 1, b: 2 }, async (value, key) => {
 *   await saveToDatabase(key, value);
 * });
 * ```
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
 * Maps over a collection asynchronously, creating a new collection of mapped values
 * Awaits each iteratee call and collects the results
 * 
 * @param obj - Collection to map over
 * @param func - Async mapping function for each element
 * @param context - Optional this context for the iteratee
 * @returns Promise that resolves to the new mapped collection
 * 
 * @example
 * ```ts
 * // Array mapping
 * const results = await asyncMap([1, 2, 3], async (num) => {
 *   const result = await fetchData(num);
 *   return result.value;
 * });
 * 
 * // Object mapping
 * const results = await asyncMap({ a: 1, b: 2 }, async (value, key) => {
 *   const result = await processValue(value);
 *   return result;
 * });
 * ```
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

/**
 * Deep equality comparison between two values
 * Handles arrays, objects, dates, regular expressions, and primitive types
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if the values are deeply equal
 * 
 * @example
 * ```ts
 * isEqual([1, 2, 3], [1, 2, 3]) // returns true
 * isEqual({ a: { b: 2 } }, { a: { b: 2 } }) // returns true
 * isEqual(new Date('2023'), new Date('2023')) // returns true
 * ```
 */
export function isEqual(a: any, b: any): boolean;

/**
 * Creates a deep clone of a value
 * Handles arrays, objects, dates, maps, sets, and primitive types
 * 
 * @param src - Value to clone
 * @returns Deep clone of the input value
 * 
 * @example
 * ```ts
 * clone({ a: [1, 2, { b: 3 }] }) // returns deep copy
 * clone(new Date()) // returns new Date instance
 * clone(new Map([['key', 'value']])) // returns new Map
 * ```
 */
export function clone<T>(src: T): T;
