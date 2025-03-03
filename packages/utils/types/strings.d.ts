/**
 * String manipulation and formatting utilities
 * @see {@link https://next.semantic-ui.com/api/utils/strings String Utilities Documentation}
 */

/**
 * Options for joining words into a sentence
 */
export interface JoinWordsOptions {
  /** Separator between words (default: ", ") */
  separator?: string;
  /** Separator before the last word (default: " and ") */
  lastSeparator?: string;
  /** Use Oxford comma (default: true) */
  oxford?: boolean;
  /** Wrap words in quotes (default: false) */
  quotes?: boolean;
  /** Transform function to apply to each word */
  transform?: ((word: string) => string) | (() => void);
}

/**
 * Options for getting the appropriate article
 */
export interface GetArticleOptions {
  /** Capitalize the article */
  capitalize?: boolean;
}

/**
 * Converts a kebab-case string to camelCase
 * Useful for converting HTML attributes to JavaScript property names
 * @see {@link https://next.semantic-ui.com/api/utils/strings#kebabtocamel kebabToCamel}
 * 
 * @param str - The kebab-case string to convert
 * @returns The camelCase version of the string
 * 
 * @example
 * ```ts
 * kebabToCamel('background-color') // returns 'backgroundColor'
 * kebabToCamel('data-test-id') // returns 'dataTestId'
 * ```
 */
export function kebabToCamel(str?: string): string;

/**
 * Converts a camelCase string to kebab-case
 * Useful for converting JavaScript property names to HTML attributes
 * @see {@link https://next.semantic-ui.com/api/utils/strings#cameltokebab camelToKebab}
 * 
 * @param str - The camelCase string to convert
 * @returns The kebab-case version of the string
 * 
 * @example
 * ```ts
 * camelToKebab('backgroundColor') // returns 'background-color'
 * camelToKebab('dataTestId') // returns 'data-test-id'
 * ```
 */
export function camelToKebab(str?: string): string;

/**
 * Capitalizes the first letter of a string
 * @see {@link https://next.semantic-ui.com/api/utils/strings#capitalize capitalize}
 * 
 * @param str - The string to capitalize
 * @returns The string with its first letter capitalized
 * 
 * @example
 * ```ts
 * capitalize('hello') // returns 'Hello'
 * capitalize('hello world') // returns 'Hello world'
 * ```
 */
export function capitalize(str?: string): string;

/**
 * Capitalizes the first letter of each word in a string
 * @see {@link https://next.semantic-ui.com/api/utils/strings#capitalizewords capitalizeWords}
 * 
 * @param str - The string to capitalize
 * @returns The string with the first letter of each word capitalized
 * 
 * @example
 * ```ts
 * capitalizeWords('hello world') // returns 'Hello World'
 * capitalizeWords('hello-world') // returns 'Hello-World'
 * ```
 */
export function capitalizeWords(str?: string): string;

/**
 * Converts a string to title case, following common English title capitalization rules
 * Handles stop words (a, an, the, etc.) appropriately
 * @see {@link https://next.semantic-ui.com/api/utils/strings#totitlecase toTitleCase}
 * 
 * @param str - The string to convert to title case
 * @returns The string in title case
 * 
 * @example
 * ```ts
 * toTitleCase('the quick brown fox') // returns 'The Quick Brown Fox'
 * toTitleCase('a tale of two cities') // returns 'A Tale of Two Cities'
 * ```
 */
export function toTitleCase(str?: string): string;

/**
 * Joins an array of words into a grammatically correct sentence
 * Supports Oxford comma and custom separators
 * @see {@link https://next.semantic-ui.com/api/utils/strings#joinwords joinWords}
 * 
 * @param words - Array of words to join
 * @param options - Configuration options for joining words
 * @returns The joined sentence
 * 
 * @example
 * ```ts
 * joinWords(['apple', 'banana', 'orange']) // returns 'apple, banana, and orange'
 * joinWords(['red', 'blue'], { lastSeparator: ' or ' }) // returns 'red or blue'
 * ```
 */
export function joinWords(words: string[], options?: JoinWordsOptions): string;

/**
 * Gets the appropriate indefinite article (a/an) for a word
 * @see {@link https://next.semantic-ui.com/api/utils/strings#getarticle getArticle}
 * 
 * @param word - The word to get the article for
 * @param options - Configuration options
 * @returns The appropriate article ('a' or 'an')
 * 
 * @example
 * ```ts
 * getArticle('house') // returns 'a'
 * getArticle('elephant') // returns 'an'
 * getArticle('user', { capitalize: true }) // returns 'A'
 * ```
 */
export function getArticle(word: string, options?: GetArticleOptions): string;
