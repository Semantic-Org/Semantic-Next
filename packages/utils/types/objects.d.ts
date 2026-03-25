/**
 * Object manipulation and traversal utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects Object Utilities Documentation}
 */

/**
 * Utility type that converts a union type to an intersection type
 * Used by the extend function to properly type the result
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Returns the keys of an object
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#keys keys}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#values values}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#mapobject mapObject}
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
  callback: (value: T[keyof T], key: keyof T) => U,
): { [K in keyof T]: U; };

/**
 * Creates a new object with filtered key-value pairs
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#filterobject filterObject}
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
  callback: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T>;

/**
 * Extends an object with properties from additional sources
 * Properly handles getters and setters
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#extend extend}
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
export function extend<T extends object, S extends object[]>(
  obj: T,
  ...sources: S
): T & UnionToIntersection<S[number]>;

/**
 * Options for deep extend operations
 */
export interface DeepExtendOptions {
  /** Preserve custom class instances instead of flattening them to plain objects */
  preserveNonCloneable?: boolean;
}

/**
 * Deep extends an object with properties from additional sources
 * Recursively merges nested plain objects and clones non-plain objects
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#deepextend deepExtend}
 * @see {@link https://next.semantic-ui.com/examples/utils-deepextend Example}
 *
 * @param obj - The target object to extend
 * @param sources - Source objects to deep merge from
 * @param options - Options controlling cloning behavior
 * @returns The modified target object
 *
 * @example
 * ```ts
 * deepExtend({ a: { x: 1 } }, { a: { y: 2 } }) // returns { a: { x: 1, y: 2 } }
 * deepExtend({}, { date: new Date() }) // clones the date object
 * deepExtend({}, { custom: new MyClass() }, { preserveNonCloneable: true }) // preserves instance
 * ```
 */
export function deepExtend<T extends object, S extends object[]>(
  obj: T,
  ...args: [...sources: S, options?: DeepExtendOptions] | S
): T & UnionToIntersection<S[number]>;

/**
 * Options for assignInPlace
 */
export interface AssignInPlaceOptions {
  /** Keep keys in target that are not in source (default false) */
  preserveExistingKeys?: boolean;
  /** Return whether any properties changed instead of the target object (default false) */
  returnChanged?: boolean;
}

/**
 * Mutates the target object in place so its contents match the source,
 * without replacing the object reference.
 * Deletes keys not present in source (unless `preserveExistingKeys` is true),
 * then assigns all source properties.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#assigninplace assignInPlace}
 * @see {@link https://next.semantic-ui.com/examples/utils-assigninplace Example}
 *
 * @param target - The object to update in place
 * @param source - The object whose properties to apply
 * @param options - Options controlling key removal and return behavior
 * @returns The mutated target object, or a boolean if `returnChanged` is true
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * assignInPlace(obj, { a: 10, c: 3 });
 * // obj is now { a: 10, c: 3 } — same reference, 'b' removed
 *
 * assignInPlace(obj, { a: 10, c: 3 }, { returnChanged: true });
 * // returns false — no changes needed
 * ```
 */
export function assignInPlace<T extends object, S extends object>(
  target: T,
  source: S,
  options?: AssignInPlaceOptions & { returnChanged: true; },
): boolean;
export function assignInPlace<T extends object, S extends object>(
  target: T,
  source: S,
  options?: AssignInPlaceOptions,
): T & S;

/**
 * Returns an object with only the specified properties
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#pick pick}
 *
 * @param obj - The source object
 * @param keys - Keys to include in the new object
 * @returns New object with only specified properties
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // returns { a: 1, c: 3 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K>;

/**
 * Access a nested object field with a string path
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#get get}
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
  path?: string,
): V | undefined;

/**
 * Creates a proxy that combines source and reference objects
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#proxyobject proxyObject}
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
  referenceObj?: U,
): T & U;

/**
 * Returns an object with only the specified keys
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#onlykeys onlyKeys}
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
  keysToKeep: K[],
): Pick<T, K>;

/**
 * Checks if an object has a specific property
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#hasproperty hasProperty}
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
  prop: PropertyKey,
): boolean;

/**
 * Reverses a lookup object's keys and values
 * If multiple keys have the same value, creates an array
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#reversekeys reverseKeys}
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
  obj: T,
): { [K in T[keyof T]]: string | string[]; };

/**
 * Converts an object to an array of key-value pairs
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#arrayfromobject arrayFromObject}
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
  obj: Record<string, T>,
): Array<{ key: string; value: T; }>;

/**
 * Match type indicating how a field matched the query
 */
type WeightedSearchMatchType = 'startsWith' | 'wordStartsWith' | 'anywhere' | 'anyWord';

/**
 * Details about a single field match returned when `returnMatches` is enabled
 */
export interface WeightedSearchMatchDetail {
  /** The property path that matched */
  field: string;
  /** How the field matched the query */
  type: WeightedSearchMatchType;
  /** Numeric score (lower is better): 1=startsWith, 2=wordStartsWith, 3=anywhere, 4+=anyWord */
  score: number;
  /** The raw (pre-lowercase) value that was matched against */
  value: string | string[] | unknown;
}

/**
 * Options for weighted object search
 */
export interface WeightedSearchOptions {
  /** Return details about how each result matched the query */
  returnMatches?: boolean;
  /** Require all query words to match (default true) */
  matchAllWords?: boolean;
  /** Property paths to search within (supports dot-path notation) */
  propertiesToMatch?: string[];
}

/**
 * Searches and ranks objects by query relevance using a weight hierarchy:
 * startsWith > wordStartsWith > anywhere > anyWord.
 *
 * Uses toLowerCase + string methods for common checks, stable sort via
 * original index, and returns spread copies (never mutates originals)
 * when `returnMatches` is enabled.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#weightedobjectsearch weightedObjectSearch}
 *
 * @param query - The search query (case-insensitive, trimmed)
 * @param objectArray - Array of objects to search
 * @param options - Search configuration options
 * @returns Filtered and sorted array based on match quality. When `returnMatches`
 *   is true, each result is a shallow copy with an added `matches` array.
 *
 * @example
 * ```ts
 * const items = [
 *   { name: 'Apple Pie', tags: ['fruit', 'dessert'] },
 *   { name: 'Green Apple', tags: ['fruit'] },
 *   { name: 'Snapple Juice', tags: ['drink'] },
 * ];
 *
 * // Basic search — sorted by relevance
 * weightedObjectSearch('apple', items, {
 *   propertiesToMatch: ['name', 'tags']
 * });
 *
 * // With match details
 * weightedObjectSearch('apple', items, {
 *   propertiesToMatch: ['name'],
 *   returnMatches: true,
 * });
 * // [{ name: 'Apple Pie', matches: [{ field: 'name', type: 'startsWith', ... }] }, ...]
 * ```
 */
export function weightedObjectSearch<T extends object>(
  query: string,
  objectArray: T[],
  options: WeightedSearchOptions & { returnMatches: true; },
): (T & { matches: WeightedSearchMatchDetail[]; })[];

export function weightedObjectSearch<T extends object>(
  query: string,
  objectArray: T[],
  options?: WeightedSearchOptions,
): T[];
