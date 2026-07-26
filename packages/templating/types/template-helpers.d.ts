import type { TruncateOptions } from '@semantic-ui/utils';

/**
 * Options accepted by the date helpers. Any other `Intl.DateTimeFormatOptions`
 * key passes through to the underlying formatter.
 */
interface DateHelperOptions extends Omit<Intl.DateTimeFormatOptions, 'timeZone'> {
  /** BCP 47 locale tag, e.g. `'en-GB'` */
  locale?: string;
  /** Force 12-hour or 24-hour output */
  hour12?: boolean;
  /** IANA zone or shorthand alias, e.g. `'UTC'`, `'local'`, `'ET'` */
  timezone?: string;
}

/**
 * Template helpers are utilities available in all templates for common operations
 * like formatting, comparisons, and data manipulation.
 * @see {@link https://next.semantic-ui.com/docs/guides/templates/helpers Template Helpers Guide}
 * @see {@link https://next.semantic-ui.com/docs/api/helpers Helpers API Reference}
 */
export interface TemplateHelpersType {
  exists(a: any): boolean;
  isEmpty(a: any): boolean;
  stringify(a: any): string;
  hasAny(a: ArrayLike<any> | undefined | null): boolean;
  range(start: number, stop?: number, step?: number): number[];
  /** Generates `count` multiples, each `(start + index) * interval` */
  sequence(count: number, interval?: number, start?: number): number[];
  /** Joins every argument with no separator. Values are stringified by `Array#join` */
  concat(...args: any[]): string;
  both(a: any, b: any): boolean;
  either(a: any, b: any): boolean;
  join(array?: any[], delimiter?: string, spaceAfter?: boolean): string | undefined;
  classes(classes?: any[], spaceAfter?: boolean): string | undefined;
  joinComma(array?: string[], oxford?: boolean, quotes?: boolean): string;
  classIf(expr: any, trueClass?: string, falseClass?: string): string;
  classMap(classObj: Record<string, any>): string;
  maybe(expr: any, trueExpr: any, falseExpr?: any): any;
  activeIf(expr: any): string;
  selectedIf(expr: any): string;
  capitalize(text?: string): string;
  titleCase(text?: string): string;
  disabledIf(expr: any): string;
  checkedIf(expr: any): string;
  maybePlural(value: number, plural?: string): string;
  not(a: any): boolean;
  is(a: any, b: any): boolean;
  notEqual(a: any, b: any): boolean;
  isExactly(a: any, b: any): boolean;
  isNotExactly(a: any, b: any): boolean;
  greaterThan(a: number, b: number): boolean;
  lessThan(a: number, b: number): boolean;
  greaterThanEquals(a: number, b: number): boolean;
  lessThanEquals(a: number, b: number): boolean;
  numberFromIndex(a: number): number;
  formatDate(date?: Date, format?: string, options?: DateHelperOptions): string;
  formatDateTime(date?: Date, format?: string, options?: DateHelperOptions): string;
  formatTime(date?: Date, format?: string, options?: DateHelperOptions): string;
  log(...args: any[]): void;
  debugger(...args: any[]): void;
  /** Lowercases and hyphen-joins a string, e.g. `'Hello World'` becomes `'hello-world'` */
  tokenize(string?: string): string;
  debugReactivity(): void;
  arrayFromObject<T>(obj: Record<string, T>): { key: string; value: T; }[];
  escapeHTML(string: string | null | undefined | false | 0): string;
  /** Reads a value or thunk without propagating downstream until it changes */
  guard<T>(value: T | (() => T)): T;
  /** Reads a value or thunk without subscribing the surrounding reaction */
  nonreactive<T>(value: T | (() => T)): T;
  isNot(a: any, b: any): boolean;
  first<T>(array: T[]): T | undefined;
  last<T>(array: T[]): T | undefined;
  count(a: ArrayLike<any> | undefined | null): number;
  default<T>(value: T | undefined | null, fallback: T): T;
  truncate(text: string | null | undefined, length: number, options?: TruncateOptions): string;
  lowercase(text: any): string;
  uppercase(text: any): string;
  roundNumber(number: number, precision?: number): number;
  round(number: number, precision?: number): number;
  roundDecimal(number: number, precision?: number): number;
  /** True when the template is running in a browser */
  isClient: boolean;
  /** True when the template is rendering on the server */
  isServer: boolean;
}

export const TemplateHelpers: TemplateHelpersType;

/**
 * Register a single template helper function
 * @see {@link https://next.semantic-ui.com/docs/guides/templates/helpers#custom-helpers Custom Helpers}
 *
 * @param name - The name of the helper function
 * @param fn - The helper function to register
 *
 * @example
 * ```ts
 * registerHelper('formatMoney', (amount) => `$${amount.toFixed(2)}`);
 * ```
 */
export function registerHelper(name: string, fn: (...args: any[]) => any): void;

/**
 * Register multiple template helper functions
 * @see {@link https://next.semantic-ui.com/docs/guides/templates/helpers#custom-helpers Custom Helpers}
 *
 * @param helpers - An object containing helper functions
 *
 * @example
 * ```ts
 * registerHelpers({
 *   formatMoney: (amount) => `$${amount.toFixed(2)}`,
 *   slugify: (text) => text.toLowerCase().replace(/\s+/g, '-')
 * });
 * ```
 */
export function registerHelpers(helpers: Record<string, (...args: any[]) => any>): void;
