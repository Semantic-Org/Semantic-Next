declare module '@semantic-ui/utils' {

  /*-------------------
         Errors
  --------------------*/

  export interface FatalOptions {
    errorType?: ErrorConstructor;
    metadata?: Record<string, any>;
    onError?: (error: Error) => void;
    removeStackLines?: number;
  }

  export function fatal(message: string, options?: FatalOptions): never;

  /*-------------------
         Browser
  --------------------*/

  export function copyText(text: string): void;

  export interface OpenLinkOptions {
    newWindow?: boolean;
    settings?: string;
    target?: string;
    event?: Event;
  }
  export function openLink(url: string, options?: OpenLinkOptions): void;
  export function getKeyFromEvent(event: KeyboardEvent): string;

  /*-------------------
           XHR
  --------------------*/

  export function getText(src: string, settings?: RequestInit): Promise<string>;
  export function getJSON<T = any>(src: string, settings?: RequestInit): Promise<T>;

  /*-------------------
          Types
  --------------------*/

  export function isObject(x: any): x is object;
  export function isPlainObject(x: any): x is Record<string, any>;
  export function isString(x: any): x is string;
  export function isBoolean(x: any): x is boolean;
  export function isNumber(x: any): x is number;
  export function isArray(x: any): x is Array<any>;
  export function isBinary(x: any): x is Uint8Array;
  export function isFunction(x: any): x is Function;
  export function isPromise(x: any): x is Promise<any>;
  export function isArguments(obj: any): boolean;
  export function isDOM(element: any): boolean;
  export function isNode(el: any): boolean;
  export function isEmpty(x: any): boolean;
  export function isClassInstance(obj: any): boolean;

  /*-------------------
          Date
  --------------------*/

  export interface FormatDateOptions {
    locale?: string;
    hour12?: boolean;
    timezone?: string;
    [key: string]: any;
  }

  export function formatDate(date: Date, format?: string, options?: FormatDateOptions): string;

  /*-------------------
      Functions
  --------------------*/
  export function noop(): void;
  export function wrapFunction<T>(x: T | (() => T)): () => T;

  export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    hashFunction?: (...args: Parameters<T>) => string | number
  ): T;

  export interface DebounceOptions {
    delay?: number;
    immediate?: boolean;
  }
  export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
  }
  export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    options: number | DebounceOptions
  ): DebouncedFunction<T>;

  /*-------------------
         Strings
  --------------------*/

  export function kebabToCamel(str?: string): string;
  export function camelToKebab(str?: string): string;
  export function capitalize(str?: string): string;
  export function capitalizeWords(str?: string): string;
  
  export interface JoinWordsOptions {
    separator?: string;
    lastSeparator?: string;
    oxford?: boolean;
    quotes?: boolean;
    transform?: (word: string) => string;
  }
  export function joinWords(words: string[], options?: JoinWordsOptions): string;

  export function getArticle(word: string, settings?: { capitalize?: boolean }): string;
  export function toTitleCase(str?: string): string;

  /*-------------------
        Arrays
  --------------------*/
  export function unique<T>(arr: T[]): T[];
  export function filterEmpty<T>(arr: T[]): NonNullable<T>[];
  export function last<T>(array: T[], number?: number): T | T[] | undefined;
  export function first<T>(array: T[], number?: number): T | T[] | undefined;
  export function firstMatch<T>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): T | undefined;
  export function findIndex<T>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): number;
  export function remove<T>(array: T[], callbackOrValue: ((value: T, index: number, array: T[]) => boolean) | T): boolean;
  export function inArray<T>(value: T, array?: T[]): boolean;
  export function range(start: number, stop?: number, step?: number): number[];
  export function sum(values: number[]): number;
  export function where<T extends object>(array: T[], properties: Partial<T>): T[];
  export function flatten<T>(arr: (T | T[])[]): T[];
  export function some<T>(collection: T[], predicate: (value: T, index: number, array: T[]) => boolean): boolean;
  export const any: typeof some;

  export function sortBy<T>(
    arr: T[],
    key: keyof T | string,
    comparator?: (valA: any, valB: any, objA: T, objB: T) => number
  ): T[];

  export function groupBy<T>(array: T[], property: keyof T | string): Record<string, T[]>;
  export function moveItem<T>(array: T[], callbackOrValue: ((value: T, index: number, array: T[]) => boolean) | T, index: number | 'first' | 'last'): T[];
  export function moveToFront<T>(array: T[], callbackOrValue: ((value: T, index: number, array: T[]) => boolean) | T): T[];
  export function moveToBack<T>(array: T[], callbackOrValue: ((value: T, index: number, array: T[]) => boolean) | T): T[];
  export function intersection<T>(...arrays: T[][]): T[];
  export function difference<T>(...arrays: T[][]): T[];
  export function uniqueItems<T>(...arrays: T[][]): T[];

  /*-------------------
         Objects
  --------------------*/

  export function keys<T extends object>(obj: T): Array<keyof T>;
  export function values<T extends object>(obj: T): Array<T[keyof T]>;

  export function filterObject<T extends object>(
    obj: T,
    callback: (value: T[keyof T], key: keyof T) => boolean
  ): Partial<T>;

  export function mapObject<T extends object, U>(
    obj: T,
    callback: (value: T[keyof T], key: keyof T) => U
  ): Record<keyof T, U>;

  export function extend<T extends object, U extends object[]>(
    obj: T,
    ...sources: U
  ): T & U[number];

  export function pick<T extends object, K extends keyof T>(
    obj: T,
    ...keys: K[]
  ): Pick<T, K>;

  export function arrayFromObject<T extends object>(obj: T): Array<{ key: keyof T; value: T[keyof T] }>;
  export function get(obj: any, path?: string): any;
  export function proxyObject<T extends object>(sourceObj?: () => T, referenceObj?: object): T;
  export function onlyKeys<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
  export function hasProperty(obj: any, prop: PropertyKey): boolean;
  export function reverseKeys(obj: Record<string, string | string[]>): Record<string, string | string[]>;
  export function weightedObjectSearch<T extends object>(
    query: string,
    objectArray: T[],
    options?: {
      returnMatches?: boolean;
      matchAllWords?: boolean;
      propertiesToMatch?: Array<keyof T>;
    }
  ): T[];

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

  /*-------------------
         Clone
  --------------------*/

  export function clone<T>(src: T): T;

  /*-------------------
      Array / Object
  --------------------*/

  export function each<T>(
    obj: T[],
    func: (value: T, index: number, array: T[]) => boolean | void,
    context?: any
  ): T[];

  export function each<T extends object>(
    obj: T,
    func: (value: T[keyof T], key: keyof T, obj: T) => boolean | void,
    context?: any
  ): T;

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

  export function asyncMap<T, U>(
    obj: T[],
    func: (value: T, index: number, array: T[]) => Promise<U>,
    context?: any
  ): Promise<U[]>;

  export function asyncMap<T extends object, U>(
    obj: T,
    func: (value: T[keyof T], key: keyof T, obj: T) => Promise<U>,
    context?: any
  ): Promise<Record<keyof T, U>>;
}
