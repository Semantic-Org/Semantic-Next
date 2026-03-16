/**
 * String manipulation and formatting utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings String Utilities Documentation}
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
  /** Include the word after the article */
  includeWord?: boolean;
}

/**
 * Options for truncating text
 */
export interface TruncateOptions {
  /** Text to append when truncated (default: "…") */
  suffix?: string;
  /** Whether to truncate at word boundaries (default: true) */
  wordBoundary?: boolean;
  /** Locale for word segmentation when using Intl.Segmenter (default: "en") */
  locale?: string;
}

/**
 * Options for reversing strings
 */
export interface ReverseStringOptions {
  /** Locale for grapheme segmentation when using Intl.Segmenter (default: "en") */
  locale?: string;
}

/**
 * Converts a kebab-case string to camelCase
 * Useful for converting HTML attributes to JavaScript property names
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#kebabtocamel kebabToCamel}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#cameltokebab camelToKebab}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#capitalize capitalize}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#capitalizewords capitalizeWords}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#totitlecase toTitleCase}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#joinwords joinWords}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#getarticle getArticle}
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

/**
 * Truncates text to a specified length with Unicode-aware word boundary handling
 * Uses Intl.Segmenter for locale-aware word segmentation when available
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#truncate truncate}
 * @see {@link https://next.semantic-ui.com/examples/utils-truncate Example}
 *
 * @param text - The text to truncate (null/undefined returns empty string)
 * @param length - Maximum length of the output
 * @param options - Truncation options
 * @returns The truncated text with suffix if needed, or original text if shorter than length
 *
 * @example
 * ```ts
 * truncate('This is a long text that needs truncating', 20)
 * // returns 'This is a long text…'
 * truncate('Short text', 20)
 * // returns 'Short text'
 * truncate('Hello 👋 World 🌍', 10)
 * // returns 'Hello 👋…'
 * truncate('こんにちは世界', 8, { locale: 'ja' })
 * // returns 'こんにちは…'
 * ```
 */
export function truncate(text: string | null | undefined, length: number, options?: TruncateOptions): string;

/**
 * Escapes HTML special characters in a string to prevent XSS attacks
 * Escapes: & < > " '
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#escapehtml escapeHTML}
 * @see {@link https://next.semantic-ui.com/examples/utils-escapehtml Example}
 *
 * @param string - The string to escape. Falsy values return an empty string.
 * @returns The string with HTML special characters escaped, or empty string for falsy input
 *
 * @example
 * ```ts
 * escapeHTML('<script>alert("XSS")</script>')
 * // returns '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 * escapeHTML('Price: $5 & "free" shipping')
 * // returns 'Price: $5 &amp; &quot;free&quot; shipping'
 * escapeHTML(null) // returns ''
 * ```
 */
export function escapeHTML(string: string | null | undefined | false | 0): string;

/**
 * Unescapes HTML entities in a string back to their original characters
 * The inverse of escapeHTML — converts &amp; &lt; &gt; &quot; &#39; back to & < > " '
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#unescapehtml unescapeHTML}
 * @see {@link https://next.semantic-ui.com/examples/utils-unescapehtml Example}
 *
 * @param string - The string containing HTML entities to unescape
 * @returns The string with HTML entities converted back to characters
 *
 * @example
 * ```ts
 * unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;')
 * // returns '<div>Hello</div>'
 * unescapeHTML('rock &amp; roll')
 * // returns 'rock & roll'
 * ```
 */
export function unescapeHTML(string: string): string;

/**
 * Reverses a string while properly handling Unicode grapheme clusters
 * Uses Intl.Segmenter for correct handling of emojis, flag sequences, skin tones, and combined characters
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#reversestring reverseString}
 * @see {@link https://next.semantic-ui.com/examples/utils-reversestring Example}
 *
 * @param str - The string to reverse (null/undefined/empty returns empty string)
 * @param options - Reversal options
 * @returns The reversed string with grapheme clusters preserved
 *
 * @example
 * ```ts
 * reverseString('hello') // returns 'olleh'
 * reverseString('Hello 👋') // returns '👋 olleH'
 * reverseString('🇺🇸🇬🇧') // returns '🇬🇧🇺🇸' (preserves flag emojis)
 * reverseString('café') // returns 'éfac' (preserves combined diacritics)
 * ```
 */
export function reverseString(str?: string, options?: ReverseStringOptions): string;
