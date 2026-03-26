/**
 * Type checking utilities for common JavaScript types
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types Type Checking Utilities Documentation}
 */

/**
 * Checks if the value is an object (excluding null)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isobject isObject}
 * @param x - The value to check
 */
export function isObject(x: unknown): x is Record<string, any>;

/**
 * Checks if the value is a plain object (created by the Object constructor)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isplainobject isPlainObject}
 * @param x - The value to check
 */
export function isPlainObject(x: unknown): x is Record<string, any>;

/**
 * Checks if the value is a string
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isstring isString}
 * @param x - The value to check
 */
export function isString(x: unknown): x is string;

/**
 * Checks if the value is a boolean
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isboolean isBoolean}
 * @param x - The value to check
 */
export function isBoolean(x: unknown): x is boolean;

/**
 * Checks if the value is a number
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isnumber isNumber}
 * @param x - The value to check
 */
export function isNumber(x: unknown): x is number;

/**
 * Checks if the value is an array
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isarray isArray}
 * @param x - The value to check
 */
export function isArray(x: unknown): x is any[];

/**
 * Checks if the value is a binary type (ArrayBuffer or typed array view)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isbinary isBinary}
 * @param x - The value to check
 */
export function isBinary(x: unknown): x is ArrayBufferView | ArrayBuffer;

/**
 * Checks if the value is a function
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isfunction isFunction}
 * @param x - The value to check
 */
export function isFunction(x: unknown): x is Function;

/**
 * Checks if the value is a promise-like object
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#ispromise isPromise}
 * @param x - The value to check
 */
export function isPromise(x: unknown): x is Promise<any>;

/**
 * Checks if the value is a Date instance (cross-realm safe)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isdate isDate}
 * @param x - The value to check
 * @returns True if the value is a Date, false otherwise
 *
 * @example
 * ```typescript
 * isDate(new Date());              // true
 * isDate(Date.now());              // false
 * isDate('2024-01-01');            // false
 * ```
 */
export function isDate(x: unknown): x is Date;

/**
 * Checks if the value is a RegExp instance (cross-realm safe)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isregexp isRegExp}
 * @param x - The value to check
 * @returns True if the value is a RegExp, false otherwise
 *
 * @example
 * ```typescript
 * isRegExp(/abc/);                 // true
 * isRegExp(new RegExp('abc'));     // true
 * isRegExp('abc');                 // false
 * ```
 */
export function isRegExp(x: unknown): x is RegExp;

/**
 * Checks if the value is an arguments object
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isarguments isArguments}
 * @param obj - The value to check
 */
export function isArguments(obj: unknown): boolean;

/**
 * Checks if the value is a DOM element
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isdom isDOM}
 * @param element - The value to check
 */
export function isDOM(element: unknown): element is Element | Document | Window | DocumentFragment;

/**
 * Checks if the value is a DOM node
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isnode isNode}
 * @param el - The value to check
 */
export function isNode(el: unknown): el is Node;

/**
 * Checks if a value is empty (null, undefined, empty string/array/object)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isempty isEmpty}
 * @param x - The value to check
 */
export function isEmpty(x: unknown): boolean;

/**
 * Checks if the value is an instance of a custom class (not a built-in type)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isclassinstance isClassInstance}
 * @param obj - The value to check
 */
export function isClassInstance(obj: unknown): boolean;

/**
 * Checks if the value is a Set instance
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#isset isSet}
 * @param x - The value to check
 * @returns True if the value is a Set, false otherwise
 *
 * @example
 * ```typescript
 * isSet(new Set([1, 2, 3]));     // true
 * isSet(new Set());              // true
 * isSet([]);                     // false
 * isSet(new Map());              // false
 * ```
 */
export function isSet(x: unknown): x is Set<any>;

/**
 * Checks if the value is a Map instance
 * @see {@link https://next.semantic-ui.com/docs/api/utils/types#ismap isMap}
 * @param x - The value to check
 * @returns True if the value is a Map, false otherwise
 *
 * @example
 * ```typescript
 * isMap(new Map([['a', 1]]));    // true
 * isMap(new Map());              // true
 * isMap({});                     // false
 * isMap(new Set());              // false
 * ```
 */
export function isMap(x: unknown): x is Map<any, any>;
