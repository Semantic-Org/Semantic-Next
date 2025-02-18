/**
 * Array manipulation utilities
 */

/**
 * Callback function for array operations
 */
export interface ArrayCallback<T> {
  (value: T, index: number, array: T[]): boolean;
}

/**
 * predicate function for array operations that find items
 */
export interface ArrayPredicate<T> {
  (value: T, index: number, array: T[]): any;
}

/**
 * Options for array operations
 */
export interface ArrayFindOptions {
  fromIndex?: number;
}

/**
 * Object property matching criteria
 */
export type MatchProperties<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Removes duplicates from an array
 *
 * @param arr - The array to remove duplicates from
 * @returns A new array with duplicate values removed
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 4]) // returns [1, 2, 3, 4]
 * unique(['a', 'b', 'a', 'c']) // returns ['a', 'b', 'c']
 * ```
 */
export function unique<T>(arr: T[]): T[];

/**
 * Returns the common elements between two or more arrays
 * High-performance implementation that switches between Set and Array methods
 * based on input size
 *
 * @param arrays - Two or more arrays to find common elements
 * @returns Array of elements common to all input arrays
 *
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 3, 4]) // returns [2, 3]
 * intersection(['a', 'b', 'c'], ['b', 'c', 'd'], ['c', 'd', 'e']) // returns ['c']
 * ```
 */
export function intersection<T>(...arrays: T[][]): T[];

/**
 * Returns elements from the first array that are not present in subsequent arrays
 * High-performance implementation that switches between Set and Array methods
 * based on input size
 *
 * @param arrays - Two or more arrays to find differences
 * @returns Array of elements unique to the first array
 *
 * @example
 * ```ts
 * difference([1, 2, 3], [2, 3, 4]) // returns [1]
 * difference(['a', 'b', 'c'], ['b', 'c', 'd'], ['c', 'd', 'e']) // returns ['a']
 * ```
 */
export function difference<T>(...arrays: T[][]): T[];

/**
 * Returns elements that appear in only one array (non-overlapping elements)
 * High-performance implementation that switches between Set and Array methods
 * based on input size
 *
 * @param arrays - Two or more arrays to find unique elements
 * @returns Array of elements that appear in exactly one array
 *
 * @example
 * ```ts
 * uniqueItems([1, 2], [2, 3], [3, 4]) // returns [1, 4]
 * uniqueItems(['a', 'b'], ['b', 'c'], ['c', 'd']) // returns ['a', 'd']
 * ```
 */
export function uniqueItems<T>(...arrays: T[][]): T[];

/**
 * Removes falsey values (false, null, 0, "", undefined, and NaN) from an array
 *
 * @param arr - The array to filter
 * @returns A new array with falsey values removed
 *
 * @example
 * ```ts
 * filterEmpty([0, 1, false, 2, '', 3]) // returns [1, 2, 3]
 * ```
 */
export function filterEmpty<T>(arr: T[]): Exclude<T, null | undefined | false | 0 | "">[];

/**
 * Gets the last element(s) from an array
 *
 * @param array - The source array
 * @param number - Number of elements to return (default: 1)
 * @returns The last element or array of last n elements
 *
 * @example
 * ```ts
 * last([1, 2, 3]) // returns 3
 * last([1, 2, 3], 2) // returns [2, 3]
 * ```
 */
export function last<T>(array: T[]): T | undefined; // No 'number' parameter
export function last<T>(array: T[], number: number): T[];  // 'number' parameter is required
export function last<T>(array: T[], number?: number): T | T[] | undefined; //combined for ease of use, optional 'number' parameter

/**
 * Gets the first element(s) from an array
 *
 * @param array - The source array
 * @param number - Number of elements to return (default: 1)
 * @returns The first element or array of first n elements
 *
 * @example
 * ```ts
 * first([1, 2, 3]) // returns 1
 * first([1, 2, 3], 2) // returns [1, 2]
 * ```
 */
export function first<T>(array: T[]): T | undefined; // No 'number' parameter
export function first<T>(array: T[], number: number): T[]; // 'number' parameter is required
export function first<T>(array: T[], number?: number): T | T[] | undefined; //combined for ease of use, optional 'number' parameter

/**
 * Returns the first element that matches the callback criteria
 *
 * @param array - The array to search
 * @param callback - Function to test each element
 * @returns The first matching element or undefined
 *
 * @example
 * ```ts
 * firstMatch([1, 2, 3, 4], x => x > 2) // returns 3
 * ```
 */
export function firstMatch<T>(array: T[], callback: ArrayCallback<T>): T | undefined;

/**
 * Finds the index of the first element that matches the callback criteria
 *
 * @param array - The array to search
 * @param callback - Function to test each element
 * @returns The index of the first matching element or -1
 *
 * @example
 * ```ts
 * findIndex([1, 2, 3], x => x === 2) // returns 1
 * ```
 */
export function findIndex<T>(array: T[], callback: ArrayCallback<T>): number;

/**
 * Removes elements from an array that match a value or callback
 *
 * @param array - The array to modify
 * @param callbackOrValue - Value to remove or function to test elements
 * @returns true if an element was removed
 *
 * @example
 * ```ts
 * remove([1, 2, 3], 2) // removes 2 from array
 * remove([1, 2, 3], x => x > 2) // removes 3 from array
 * ```
 */
export function remove<T>(array: T[], callbackOrValue: T | ArrayCallback<T>): boolean;

/**
 * Checks if a value exists in an array
 *
 * @param value - The value to search for
 * @param array - The array to search in
 * @returns true if the value is found
 *
 * @example
 * ```ts
 * inArray(2, [1, 2, 3]) // returns true
 * inArray(4, [1, 2, 3]) // returns false
 * ```
 */
export function inArray<T>(array: T[], value: T): boolean;

/**
 * Creates an array of numbers progressing from start up to, but not including, end
 *
 * @param start - The start number
 * @param stop - The end number
 * @param step - The value to increment by (default: 1)
 * @returns Array of numbers
 *
 * @example
 * ```ts
 * range(4) // returns [0, 1, 2, 3]
 * range(1, 5) // returns [1, 2, 3, 4]
 * range(0, 20, 5) // returns [0, 5, 10, 15]
 * ```
 */
export function range(stop: number): number[]; // Only 'stop' provided
export function range(start: number, stop: number): number[]; // 'start' and 'stop' provided
export function range(start: number, stop: number, step: number): number[];// 'start', 'stop', and 'step' provided
export function range(start: number, stop?: number, step?: number): number[]; //combined for ease of use

/**
 * Calculates the sum of an array of numbers
 *
 * @param values - Array of numbers to sum
 * @returns The sum of all numbers
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4]) // returns 10
 * ```
 */
export function sum(values: number[]): number;

/**
 * Filters an array of objects by matching properties
 *
 * @param array - Array of objects to filter
 * @param properties - Object of properties to match
 * @returns Array of objects with matching properties
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, name: 'John', age: 20 },
 *   { id: 2, name: 'Jane', age: 20 }
 * ];
 * where(users, { age: 20 }) // returns both users
 * where(users, { name: 'John' }) // returns first user
 * ```
 */
export function where<T extends object>(array: T[], properties: MatchProperties<T>): T[];

/**
 * Flattens a nested array structure
 *
 * @param arr - The array to flatten
 * @returns A new flattened array
 *
 * @example
 * ```ts
 * flatten([1, [2, 3], [4, [5]]]) // returns [1, 2, 3, 4, 5]
 * ```
 */
export function flatten<T>(arr: (T | T[])[]): T[];

/**
 * Tests whether at least one element in the array passes the test
 *
 * @param collection - The array to test
 * @param predicate - Function to test each element
 * @returns true if any element passes the test
 *
 * @example
 * ```ts
 * some([1, 2, 3], x => x > 2) // returns true
 * some([1, 2, 3], x => x > 3) // returns false
 * ```
 */
export function some<T>(collection: T[], predicate: ArrayCallback<T>): boolean;

/**
 * Alias for some()
 */
export const any: typeof some;

/**
 * Sorts an array of objects by a specific key with optional comparator
 *
 * @param arr - Array to sort
 * @param key - Key to sort by
 * @param comparator - Optional custom comparison function
 * @returns A new sorted array
 *
 * @example
 * ```ts
 * const users = [
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 25 }
 * ];
 * sortBy(users, 'age') // sorts by age ascending
 * sortBy(users, 'age', (a, b) => b - a) // sorts by age descending
 * ```
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  comparator?: (a: T[keyof T], b: T[keyof T], objA: T, objB: T) => number
): T[];

/**
 * Groups an array of objects by a property value
 *
 * @param array - Array to group
 * @param property - Property to group by
 * @returns Object with groups
 *
 * @example
 * ```ts
 * const users = [
 *   { role: 'admin', name: 'John' },
 *   { role: 'user', name: 'Jane' },
 *   { role: 'admin', name: 'Mike' }
 * ];
 * groupBy(users, 'role')
 * // returns:
 * // {
 * //   admin: [{ role: 'admin', name: 'John' }, { role: 'admin', name: 'Mike' }],
 * //   user: [{ role: 'user', name: 'Jane' }]
 * // }
 * ```
 */
export function groupBy<T>(array: T[], property: keyof T): Record<string, T[]>;

/**
 * Moves an element to a specific index in an array
 *
 * @param array - The array to modify
 * @param callbackOrValue - Value or callback to identify the element
 * @param index - Target index or 'first'/'last'
 * @returns The modified array
 *
 * @example
 * ```ts
 * moveItem([1, 2, 3, 4], 3, 0) // returns [3, 1, 2, 4]
 * moveItem([1, 2, 3, 4], 2, 'last') // returns [1, 3, 4, 2]
 * moveItem(users, user => user.id === 5, 0) // moves user with id 5 to start
 * ```
 */
export function moveItem<T>(
  array: T[],
  callbackOrValue: T | ArrayPredicate<T>,
  index: number | 'first' | 'last'
): T[];

/**
 * Moves an element to the start of an array
 *
 * @param array - The array to modify
 * @param callbackOrValue - Value or callback to identify the element
 * @returns The modified array
 *
 * @example
 * ```ts
 * moveToFront([1, 2, 3], 2) // returns [2, 1, 3]
 * moveToFront(users, user => user.id === 5) // moves user with id 5 to start
 * ```
 */
export function moveToFront<T>(
  array: T[],
  callbackOrValue: T | ArrayPredicate<T>
): T[];

/**
 * Moves an element to the end of an array
 * @param array - The array to modify
 * @param callbackOrValue - Value or callback to identify the element
 * @returns The modified array
 *
 * @example
 * ```ts
 * moveToBack([1, 2, 3], 2) // returns [1, 3, 2]
 * moveToBack(users, user => user.id === 5) // moves user with id 5 to end
 * ```
 */
export function moveToBack<T>(
  array: T[],
  callbackOrValue: T | ArrayPredicate<T>
): T[];
  