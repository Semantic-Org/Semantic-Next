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
  hasAny(a: any[] | undefined | null): boolean;
  range(start: number, stop?: number, step?: number): number[];
  concat(...args: string[]): string;
  both(a: any, b: any): boolean;
  either(a: any, b: any): boolean;
  join(array: string[], delimiter?: string, spaceAfter?: boolean): string | undefined;
  classes(classes: string[], spaceAfter?: boolean): string | undefined;
  joinComma(array?: string[], oxford?: boolean, quotes?: boolean): string;
  classIf(expr: any, trueClass?: string, falseClass?: string): string;
  classMap(classObj: Record<string, any>): string;
  maybe(expr: any, trueExpr: any, falseExpr: any): any;
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
  formatDate(date?: Date, format?: string, options?: { timezone?: string; }): string;
  formatDateTime(date?: Date, format?: string, options?: { timezone?: string; }): string;
  formatTime(date?: Date, format?: string, options?: { timezone?: string; }): string;
  log(...args: any[]): void;
  debugger(): void;
  tokenize(string?: string): string[];
  debugReactivity(): void;
  arrayFromObject(obj: Record<string, any>): { key: string; value: any; }[];
  escapeHTML(string: string): string;
  guard<T>(fn: () => T): T | undefined;
  nonreactive<T>(fn: () => T): T;
  isNot(a: any, b: any): boolean;
  first<T>(array: T[]): T | undefined;
  last<T>(array: T[]): T | undefined;
  count(a: any[] | undefined | null): number;
  default<T>(value: T | undefined | null, fallback: T): T;
  truncate(text: string, length: number, options?: any): string;
  lowercase(text: any): string;
  uppercase(text: any): string;
  roundNumber(number: number, precision?: number): number;
  round(number: number, precision?: number): number;
  roundDecimal(number: number, precision?: number): number;
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
