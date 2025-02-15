/*-------------------
       Errors
--------------------*/
export function fatal(
  message: string,
  options?: {
    errorType?: new (message: string) => Error;
    metadata?: Record<string, any>;
    onError?: ((error: Error) => void) | null;
    removeStackLines?: number;
  }
): void;

/*-------------------
      Browser
--------------------*/

export function copyText(text: string): Promise<void>;

export function openLink(
  url: string,
  options?: {
    newWindow?: boolean;
    settings?: string;
    target?: string;
    event?: Event;
  }
): void;

export function getKeyFromEvent(event: KeyboardEvent): string;

/*-------------------
         XHR
--------------------*/
export function getText(src: string, settings?: RequestInit): Promise<string>;

export function getJSON(src: string, settings?: RequestInit): Promise<any>;

/*-------------------
        Types
--------------------*/
export function isObject(x: any): boolean;
export function isPlainObject(x: any): boolean;
export function isString(x: any): boolean;
export function isBoolean(x: any): boolean;
export function isNumber(x: any): boolean;
export function isArray(x: any): boolean;
export function isBinary(x: any): boolean;
export function isFunction(x: any): boolean;
export function isPromise(x: any): boolean;
export function isArguments(obj: any): boolean;
export function isDOM(element: any): boolean;
export function isNode(el: any): boolean;
export function isEmpty(x: any): boolean;
export function isClassInstance(obj: any): boolean;

/*-------------------
        Date
--------------------*/
export function formatDate(
  date: Date,
  format?: string,
  options?: {
    locale?: string;
    hour12?: boolean;
    timezone?: string;
    [key: string]: any;
  }
): string;

/*-------------------
      Functions
--------------------*/
export function noop(): void;

export function wrapFunction<T>(x: T | (() => T)): () => T;

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  hashFunction?: (args: any[]) => any
): T;

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  options: number | { delay?: number; immediate?: boolean }
): T & { cancel: () => void };

/*-------------------
      Strings
--------------------*/
export function kebabToCamel(str?: string): string;
export function camelToKebab(str?: string): string;
export function capitalize(str?: string): string;
export function capitalizeWords(str?: string): string;
export function toTitleCase(str: string): string;
export function joinWords(
  words: string[],
  options?: {
    separator?: string;
    lastSeparator?: string;
    oxford?: boolean;
    quotes?: boolean;
    transform?: ((word: string) => string) | null;
  }
): string;
export function getArticle(word: string, settings?: { capitalize?: boolean }): string;

/*-------------------
       Arrays
--------------------*/
export function unique<T>(arr: T[]): T[];
export function filterEmpty<T>(arr: T[]): T[];

export function last<T>(array: T[]): T | undefined;
export function last<T>(array: T[], number: number): T[];

export function first<T>(array: T[]): T | undefined;
export function first<T>(array: T[], number: number): T[];

export function firstMatch<T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => boolean
): T | undefined;

export function findIndex<T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => boolean
): number;

export function remove<T>(
  array: T[],
  callbackOrValue: ((value: T) => boolean) | T
): boolean;

export function inArray<T>(value: T, array?: T[]): boolean;

export function range(start: number, stop?: number, step?: number): number[];

export function sum(values: number[]): number;

export function where<T extends object>(
  array: T[],
  properties: Partial<T>
): T[];

export function flatten(arr: any[]): any[];

export function some<T>(
  collection: Array<T> | { some(predicate: (value: T, index: number, array: T[]) => boolean): boolean } | null | undefined,
  predicate: (value: T, index: number, array: T[]) => boolean
): boolean;
export { some as any };

export function sortBy<T>(
  arr: T[],
  key: string,
  comparator?: (valA: any, valB: any, a: T, b: T) => number
): T[];

export function groupBy<T>(array: T[], property: string): { [key: string]: T[] };

export function moveItem<T>(
  array: T[],
  callbackOrValue: ((value: T) => boolean) | T,
  index: number | 'first' | 'last'
): T[];

export function moveToFront<T>(
  array: T[],
  callbackOrValue: ((value: T) => boolean) | T
): T[];

export function moveToBack<T>(
  array: T[],
  callbackOrValue: ((value: T) => boolean) | T
): T[];

export function intersection<T>(...arrays: T[][]): T[];

export function difference<T>(...arrays: T[][]): T[];

export function uniqueItems<T>(...arrays: T[][]): T[];

/*-------------------
      Objects
--------------------*/
export function keys(obj: any): string[] | undefined;
export function values(obj: any): any[] | undefined;

export function filterObject<T extends object>(
  obj: T,
  callback: (value: T[keyof T], key: string) => boolean
): Partial<T>;

export function mapObject<T extends object, U>(
  obj: T,
  callback: (value: T[keyof T], key: string) => U
): { [K in keyof T]: U };

export function extend(obj: any, ...sources: any[]): any;

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;

export interface KeyValue {
  key: string;
  value: any;
}
export function arrayFromObject(obj: any): KeyValue[];

export function get(obj: any, path?: string): any;

export function proxyObject<T extends object>(
  sourceObj?: () => any,
  referenceObj?: T
): T;

export function onlyKeys<T extends object>(
  obj: T,
  keysToKeep: (keyof T)[]
): Partial<T>;

export function hasProperty(obj: object, prop: PropertyKey): boolean;

export function reverseKeys(obj: { [key: string]: any }): { [key: string]: string | string[] };

export function weightedObjectSearch(
  query?: string,
  objectArray?: any[],
  options?: {
    returnMatches?: boolean;
    matchAllWords?: boolean;
    propertiesToMatch?: string[];
  }
): any[];

/*-------------------
   Array / Object
--------------------*/
export function clone<T>(src: T, seen?: Map<any, any>): T;

export function each<T>(
  obj: T[] | { [key: string]: T },
  func: (value: T, key: number | string, obj: T[] | { [key: string]: T }) => any,
  context?: any
): T[] | { [key: string]: T };

export function asyncEach<T>(
  obj: T[] | { [key: string]: T },
  func: (value: T, key: number | string, obj: T[] | { [key: string]: T }) => Promise<any>,
  context?: any
): Promise<T[] | { [key: string]: T }>;

export function asyncMap<T, U>(
  obj: T[] | { [key: string]: T },
  func: (value: T, key: number | string, obj: T[] | { [key: string]: T }) => Promise<U>,
  context?: any
): Promise<U[] | { [key: string]: U }>;

/*-------------------
      Numbers
--------------------*/
export function roundNumber(number: number, digits?: number): number;

/*-------------------
      RegExp
--------------------*/
export function escapeRegExp(string: string): string;
export function escapeHTML(string: string): string;

/*-------------------
     Identity
--------------------*/
export function tokenize(str?: string): string;
export function prettifyID(num: number): string;
export function hashCode(
  input: any,
  options?: { prettify?: boolean; seed?: number }
): number | string;
export function generateID(): string;
export function isEqual(a: any, b: any, options?: any): boolean;

/*-------------------
     Constants
--------------------*/
export const isServer: boolean;
export const isClient: boolean;
