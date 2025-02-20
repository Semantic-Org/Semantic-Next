/**
 * Type checking utilities for common JavaScript types
 */

/**
 * Checks if the value is an object (excluding null)
 * @param x - The value to check
 */
export function isObject(x: unknown): x is Record<string, any>;

/**
 * Checks if the value is a plain object (created by the Object constructor)
 * @param x - The value to check
 */
export function isPlainObject(x: unknown): x is Record<string, any>;

/**
 * Checks if the value is a string
 * @param x - The value to check
 */
export function isString(x: unknown): x is string;

/**
 * Checks if the value is a boolean
 * @param x - The value to check
 */
export function isBoolean(x: unknown): x is boolean;

/**
 * Checks if the value is a number
 * @param x - The value to check
 */
export function isNumber(x: unknown): x is number;

/**
 * Checks if the value is an array
 * @param x - The value to check
 */
export function isArray(x: unknown): x is any[];

/**
 * Checks if the value is a binary array (Uint8Array)
 * @param x - The value to check
 */
export function isBinary(x: unknown): x is Uint8Array;

/**
 * Checks if the value is a function
 * @param x - The value to check
 */
export function isFunction(x: unknown): x is Function;

/**
 * Checks if the value is a promise-like object
 * @param x - The value to check
 */
export function isPromise(x: unknown): x is Promise<any>;

/**
 * Checks if the value is an arguments object
 * @param obj - The value to check
 */
export function isArguments(obj: unknown): boolean;

/**
 * Checks if the value is a DOM element
 * @param element - The value to check
 */
export function isDOM(element: unknown): element is Element | Document | Window | DocumentFragment;

/**
 * Checks if the value is a DOM node
 * @param el - The value to check
 */
export function isNode(el: unknown): el is Node;

/**
 * Checks if a value is empty (null, undefined, empty string/array/object)
 * @param x - The value to check
 */
export function isEmpty(x: unknown): boolean;

/**
 * Checks if the value is an instance of a custom class (not a built-in type)
 * @param obj - The value to check
 */
export function isClassInstance(obj: unknown): boolean;
