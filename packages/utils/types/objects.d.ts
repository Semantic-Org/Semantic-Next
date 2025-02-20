/**
 * Object manipulation utilities
 */

/**
 * Returns the keys of an object
 * 
 * @param obj - The object to get keys from
 * @returns Array of object keys
 * 
 * @example
 * ```ts
 * keys({ a: 1, b: 2 }) // returns ['a', 'b']
 * ```
 */
export function keys<T extends object>(obj: T): Array<keyof T>;

/**
 * Returns the values of an object
 * 
 * @param obj - The object to get values from
 * @returns Array of object values
 * 
 * @example
 * ```ts
 * values({ a: 1, b: 2 }) // returns [1, 2]
 * ```
 */
export function values<T extends object>(obj: T): Array<T[keyof T]>;

/**
 * Creates a new object with transformed values
 * 
 * @param obj - The source object
 * @param callback - Function to transform values
 * @returns New object with transformed values
 * 
 * @example
 * ```ts
 * mapObject({ a: 1, b: 2 }, x => x * 2) // returns { a: 2, b: 4 }
 * ```
 */
export function mapObject<T extends object, U>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U };

/**
 * Creates a new object with filtered key-value pairs
 * 
 * @param obj - The source object
 * @param callback - Function to test each key-value pair
 * @returns New object with filtered pairs
 * 
 * @example
 * ```ts
 * filterObject({ a: 1, b: 2, c: 3 }, v => v > 1) // returns { b: 2, c: 3 }
 * ```
 */
export function filterObject<T extends object>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T) => boolean
): Partial<T>;

/**
 * Extends an object with properties from additional sources
 * Properly handles getters and setters
 * 
 * @param obj - The target object
 * @param sources - Source objects to copy from
 * @returns The modified target object
 * 
 * @example
 * ```ts
 * extend({ a: 1 }, { b: 2 }, { c: 3 }) // returns { a: 1, b: 2, c: 3 }
 * ```
 */

export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K>;

/**
 * Access a nested object field with a string path
 * 
 * @param obj - The object to traverse
 * @param path - The path string (e.g., 'a.b.c' or 'items[0].name')
 * @returns The value at the path or undefined if not found
 * 
 * @example
 * ```ts
 * const obj = { a: { b: { c: 1 } } };
 * get(obj, 'a.b.c') // returns 1
 * get(obj, 'a.b.d') // returns undefined
 * get(obj, 'items[0].name') // supports array indexing
 * ```
 */
export function get<T extends object, V = any>(
  obj: T,
  path?: string
): V | undefined;

/**
 * Creates a proxy that combines source and reference objects
 * 
 * @param sourceObj - Function that returns the source object
 * @param referenceObj - Reference object to combine with source
 * @returns Proxy combining both objects
 * 
 * @example
 * ```ts
 * const source = { a: 1, b: 2 };
 * const reference = { c: 3 };
 * const proxy = proxyObject(() => source, reference);
 * proxy.a // returns 1
 * proxy.c // returns 3
 * ```
 */
export function proxyObject<T extends object, U extends object>(
  sourceObj: () => T,
  referenceObj?: U
): T & U;

/**
 * Returns an object with only the specified keys
 * 
 * @param obj - The source object
 * @param keysToKeep - Array of keys to keep
 * @returns New object with only specified keys
 * 
 * @example
 * ```ts
 * onlyKeys({ a: 1, b: 2, c: 3 }, ['a', 'c']) // returns { a: 1, c: 3 }
 * ```
 */
export function onlyKeys<T extends object, K extends keyof T>(
  obj: T,
  keysToKeep: K[]
): Pick<T, K>;

/**
 * Checks if an object has a specific property
 * 
 * @param obj - The object to check
 * @param prop - The property to check for
 * @returns True if the property exists
 * 
 * @example
 * ```ts
 * hasProperty({ a: 1 }, 'a') // returns true
 * hasProperty({ a: 1 }, 'b') // returns false
 * ```
 */
export function hasProperty<T extends object>(
  obj: T,
  prop: PropertyKey
): boolean;

/**
 * Reverses a lookup object's keys and values
 * If multiple keys have the same value, creates an array
 * 
 * @param obj - The object to reverse
 * @returns New object with reversed keys and values
 * 
 * @example
 * ```ts
 * reverseKeys({ a: 1, b: 2 }) // returns { '1': 'a', '2': 'b' }
 * reverseKeys({ a: 1, b: 1 }) // returns { '1': ['a', 'b'] }
 * ```
 */
export function reverseKeys<T extends object>(
  obj: T
): { [K in T[keyof T]]: string | string[] };

/**
 * Converts an object to an array of key-value pairs
 * 
 * @param obj - The object to convert
 * @returns Array of key-value pair objects
 * 
 * @example
 * ```ts
 * arrayFromObject({ a: 1, b: 2 })
 * // returns [{ key: 'a', value: 1 }, { key: 'b', value: 2 }]
 * ```
 */
export function arrayFromObject<T>(
  obj: Record<string, T>
): Array<{ key: string; value: T }>;

/**
 * Options for weighted object search
 */
export interface WeightedSearchOptions {
  /** Return details about matches */
  returnMatches?: boolean;
  /** Require all words to match */
  matchAllWords?: boolean;
  /** Properties to search within */
  propertiesToMatch?: string[];
}

/**
 * Performs a weighted search across an array of objects
 * 
 * @param query - The search query
 * @param objectArray - Array of objects to search
 * @param options - Search configuration options
 * @returns Filtered and sorted array based on match quality
 * 
 * @example
 * ```ts
 * const users = [
 *   { name: 'John Smith', email: 'john@example.com' },
 *   { name: 'Jane Smith', email: 'jane@example.com' }
 * ];
 * weightedObjectSearch('john', users, {
 *   propertiesToMatch: ['name', 'email']
 * });
 * ```
 */
export function weightedObjectSearch<T extends object>(
  query: string,
  objectArray: T[],
  options?: WeightedSearchOptions
): T[];
