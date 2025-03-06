/**
 * Type checking utilities for common JavaScript types
 * @see {@link https://next.semantic-ui.com/api/utils/types Type Checking Utilities Documentation}
 */

/**
 * Checks if the value is an object (excluding null)
 * @see {@link https://next.semantic-ui.com/api/utils/types#isobject isObject}
 * @param x - The value to check
 */
export function isObject(x: unknown): x is Record<string, any>;

/**
 * Checks if the value is a plain object (created by the Object constructor)
 * @see {@link https://next.semantic-ui.com/api/utils/types#isplainobject isPlainObject}
 * @param x - The value to check
 */
export function isPlainObject(x: unknown): x is Record<string, any>;

/**
 * Checks if the value is a string
 * @see {@link https://next.semantic-ui.com/api/utils/types#isstring isString}
 * @param x - The value to check
 */
export function isString(x: unknown): x is string;

/**
 * Checks if the value is a boolean
 * @see {@link https://next.semantic-ui.com/api/utils/types#isboolean isBoolean}
 * @param x - The value to check
 */
export function isBoolean(x: unknown): x is boolean;

/**
 * Checks if the value is a number
 * @see {@link https://next.semantic-ui.com/api/utils/types#isnumber isNumber}
 * @param x - The value to check
 */
export function isNumber(x: unknown): x is number;

/**
 * Checks if the value is an array
 * @see {@link https://next.semantic-ui.com/api/utils/types#isarray isArray}
 * @param x - The value to check
 */
export function isArray(x: unknown): x is any[];

/**
 * Checks if the value is a binary array (Uint8Array)
 * @see {@link https://next.semantic-ui.com/api/utils/types#isbinary isBinary}
 * @param x - The value to check
 */
export function isBinary(x: unknown): x is Uint8Array;

/**
 * Checks if the value is a function
 * @see {@link https://next.semantic-ui.com/api/utils/types#isfunction isFunction}
 * @param x - The value to check
 */
export function isFunction(x: unknown): x is Function;

/**
 * Checks if the value is a promise-like object
 * @see {@link https://next.semantic-ui.com/api/utils/types#ispromise isPromise}
 * @param x - The value to check
 */
export function isPromise(x: unknown): x is Promise<any>;

/**
 * Checks if the value is an arguments object
 * @see {@link https://next.semantic-ui.com/api/utils/types#isarguments isArguments}
 * @param obj - The value to check
 */
export function isArguments(obj: unknown): boolean;

/**
 * Checks if the value is a DOM element
 * @see {@link https://next.semantic-ui.com/api/utils/types#isdom isDOM}
 * @param element - The value to check
 */
export function isDOM(element: unknown): element is Element | Document | Window | DocumentFragment;

/**
 * Checks if the value is a DOM node
 * @see {@link https://next.semantic-ui.com/api/utils/types#isnode isNode}
 * @param el - The value to check
 */
export function isNode(el: unknown): el is Node;

/**
 * Checks if a value is empty (null, undefined, empty string/array/object)
 * @see {@link https://next.semantic-ui.com/api/utils/types#isempty isEmpty}
 * @param x - The value to check
 */
export function isEmpty(x: unknown): boolean;

/**
 * Checks if the value is an instance of a custom class (not a built-in type)
 * @see {@link https://next.semantic-ui.com/api/utils/types#isclassinstance isClassInstance}
 * @param obj - The value to check
 */
export function isClassInstance(obj: unknown): boolean;
