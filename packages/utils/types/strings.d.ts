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
  /** Transform applied to each word before joining (defaults to identity) */
  transform?: (word: string) => string;
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
 * Options for kebab-to-camel conversion
 */
export interface KebabToCamelOptions {
  /** Character used to encode digit-leading segments (default: "_") */
  separator?: string;
}

/**
 * Options for humanizing an identifier
 */
export interface HumanizeOptions {
  /** Title-case the result instead of sentence case, respecting stop words (default: false) */
  titleCase?: boolean;
  /** Drop a trailing "id" segment, e.g. user_id -> User (default: true) */
  dropId?: boolean;
  /** Treat input as CONSTANT_CASE, sentence-casing shouting enums like IN_PROGRESS instead of preserving them as acronyms (default: false) */
  constantCase?: boolean;
  /** Per-call term overrides, a lowercased token mapped to its exact display string, layered over `humanize.config.terms` */
  terms?: Record<string, string>;
}

/**
 * Global humanize defaults and term vocabulary. Set once at app boot and every call inherits it.
 */
export interface HumanizeConfig {
  titleCase: boolean;
  dropId: boolean;
  constantCase: boolean;
  /** Token vocabulary, a lowercased token mapped to its exact display string. Seeded with `id`, `url`, `api` */
  terms: Record<string, string>;
}

/**
 * Options for camel-to-kebab conversion
 */
export interface CamelToKebabOptions {
  /** Preserve leading uppercase for exact round-trip instead of normalizing for DOM safety (default: false) */
  lossless?: boolean;
  /** Character used to decode digit-leading segments (default: "_") */
  separator?: string;
}

/**
 * Converts a kebab-case string to camelCase with lossless round-trip support
 * Digit-leading segments are preserved with an underscore prefix (e.g. `grid-2x2` becomes `grid_2x2`)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#kebabtocamel kebabToCamel}
 *
 * @param str - The kebab-case string to convert
 * @param options - Conversion options
 * @returns The camelCase version of the string
 *
 * @example
 * ```ts
 * kebabToCamel('background-color') // returns 'backgroundColor'
 * kebabToCamel('grid-2x2') // returns 'grid_2x2'
 * kebabToCamel('arrow-down-a-z') // returns 'arrowDownAZ'
 * ```
 */
export function kebabToCamel(str?: string, options?: KebabToCamelOptions): string;

/**
 * Converts a camelCase string to kebab-case with lossless round-trip support
 * Underscore-digit sequences are decoded back to hyphen-digit (e.g. `grid_2x2` becomes `grid-2x2`)
 * By default, normalizes leading uppercase for DOM-safe attribute names
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#cameltokebab camelToKebab}
 *
 * @param str - The camelCase string to convert
 * @param options - Conversion options
 * @returns The kebab-case version of the string
 *
 * @example
 * ```ts
 * camelToKebab('backgroundColor') // returns 'background-color'
 * camelToKebab('grid_2x2') // returns 'grid-2x2'
 * camelToKebab('FooBar') // returns 'foo-bar' (PascalCase normalized)
 * camelToKebab('FooBar', { lossless: true }) // returns '-foo-bar' (preserved for round-trip)
 * ```
 */
export function camelToKebab(str?: string, options?: CamelToKebabOptions): string;

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
 * The stop-word vocabulary for title casing, read by every {@link toTitleCase} call and by
 * {@link humanize}'s titleCase mode. Style guides disagree on the list, so it is editable once
 * at app boot (e.g. `toTitleCase.config.stopWords.push('versus')`).
 */
export interface ToTitleCaseConfig {
  /** Words kept lowercase mid-title (first and last words always capitalize) */
  stopWords: string[];
}

/**
 * Converts a string to title case, following common English title capitalization rules
 * Stop words stay lowercase mid-title, read from the editable `toTitleCase.config.stopWords`
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
export namespace toTitleCase {
  /** The stop-word vocabulary. Set once at app boot; humanize's titleCase mode reads the same list */
  let config: ToTitleCaseConfig;
}

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
 * The exceptions vocabulary for {@link getArticle} — words whose sound contradicts their spelling,
 * where the vowel heuristic reads them wrong. Editable once at app boot
 * (e.g. `getArticle.config.exceptions.faq = 'an'`).
 */
export interface GetArticleConfig {
  /** Lowercased word mapped to its article, checked before the vowel heuristic */
  exceptions: Record<string, string>;
}

/**
 * Gets the appropriate indefinite article (a/an) for a word
 * Sound-contradicts-spelling words (hour, university) come from the editable `getArticle.config.exceptions`
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
 * getArticle('hour') // returns 'an' (exceptions vocabulary)
 * getArticle('user', { capitalize: true }) // returns 'A'
 * ```
 */
export function getArticle(word: string, options?: GetArticleOptions): string;
export namespace getArticle {
  /** The exceptions vocabulary. Set once at app boot; per-word lookup runs before the vowel heuristic */
  let config: GetArticleConfig;
}

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

/**
 * Converts a string to a lowercase, hyphen-joined token (slug-style)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#tokenize tokenize}
 *
 * @param str - The input string
 * @returns The tokenized string
 *
 * @example
 * ```ts
 * tokenize('Hello World') // returns 'hello-world'
 * tokenize('A simple-test_string') // returns 'a-simple-test-string'
 * ```
 */
export function tokenize(str?: string): string;

/**
 * Converts a machine identifier into human-readable label text, the display-side inverse of tokenize
 * Splits snake_case, kebab-case, camelCase, and PascalCase, keeping acronym runs intact (HTTP, XML)
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#humanize humanize}
 * @see {@link https://next.semantic-ui.com/examples/utils-humanize Example}
 *
 * @param str - The identifier to humanize (null/undefined/non-string returns empty string)
 * @param options - Humanization options
 * @returns The humanized label
 *
 * @example
 * ```ts
 * humanize('first_name') // returns 'First name'
 * humanize('getHTTPResponse') // returns 'Get HTTP response'
 * humanize('user_id') // returns 'User' (drops trailing id)
 * humanize('api_url') // returns 'API URL' (default vocabulary)
 * humanize('employee_salary', { titleCase: true }) // returns 'Employee Salary'
 *
 * // set an app-wide vocabulary once
 * humanize.config.terms.sku = 'SKU';
 * humanize('product_sku') // returns 'Product SKU'
 * ```
 */
export function humanize(str?: string, options?: HumanizeOptions): string;
export namespace humanize {
  /** Global defaults and term vocabulary. Set once at app boot and every call inherits it */
  let config: HumanizeConfig;
}

/**
 * Options for computing edit distance between two strings
 */
export interface EditDistanceOptions {
  /** Stop once the distance provably exceeds this and return Infinity (default: Infinity) */
  max?: number;
  /** Lowercase both strings before comparing (default: false) */
  ignoreCase?: boolean;
  /** Apply Unicode NFC normalization first, so canonically equivalent spellings read as identical (default: true) */
  normalize?: boolean;
  /** Compare grapheme clusters via Intl.Segmenter, so a flag or family emoji is one unit (default: false) */
  grapheme?: boolean;
  /** Locale for grapheme segmentation (default: "en") */
  locale?: string;
  /** Count an adjacent swap as one edit, the restricted Damerau-Levenshtein reading (default: false) */
  swaps?: boolean;
  /** Cost of inserting a character (default: 1) */
  insertCost?: number;
  /** Cost of deleting a character (default: 1) */
  deleteCost?: number;
  /** Cost of replacing a character (default: 1) */
  replaceCost?: number;
  /** Cost of an adjacent swap when swaps is on (default: 1) */
  swapCost?: number;
}

/**
 * Options for scoring string similarity
 */
export interface SimilarityOptions {
  /** Score floor for early exit — a comparison that cannot reach it stops and reports 0 (default: 0) */
  min?: number;
  /** Lowercase both strings before comparing (default: false) */
  ignoreCase?: boolean;
  /** Apply Unicode NFC normalization first (default: true) */
  normalize?: boolean;
  /** Compare grapheme clusters via Intl.Segmenter (default: false) */
  grapheme?: boolean;
  /** Locale for grapheme segmentation (default: "en") */
  locale?: string;
  /** Count an adjacent swap as one edit (default: false) */
  swaps?: boolean;
}

/**
 * Options for suggesting the nearest candidates to a mistyped word
 */
export interface SuggestOptions {
  /** Minimum similarity (0..1) a candidate must reach to be suggested (default: 0.6) */
  threshold?: number;
  /** Read case differences as typos (default: true) */
  ignoreCase?: boolean;
  /** Read adjacent swaps as single typos (default: true) */
  swaps?: boolean;
  /** Return the plausible candidates as an array, best-first, up to this many ([] when none) */
  count?: number;
}

/** A candidate vocabulary: an array or Set of names, a lone name, or the keys of a plain object or Map */
export type SuggestCandidates =
  | ReadonlyArray<unknown>
  | string
  | ReadonlySet<unknown>
  | ReadonlyMap<unknown, unknown>
  | Record<string, unknown>
  | Iterable<unknown>;

/**
 * Computes how many single-character edits (inserts, deletes, replacements, and
 * optionally adjacent swaps) turn one string into the other — 0 means identical
 * Compares Unicode code points after NFC normalization by default, grapheme clusters with `grapheme: true`
 * `max` caps the search and returns Infinity once the distance provably exceeds it, the cheap-rejection shape for fuzzy-match loops
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#editdistance editDistance}
 * @see {@link https://next.semantic-ui.com/examples/utils-editdistance Example}
 *
 * @param a - The first string (nullish reads as empty, other input is stringified)
 * @param b - The second string
 * @param options - Comparison options
 * @returns The edit distance, or Infinity when it exceeds `max`
 *
 * @example
 * ```ts
 * editDistance('kitten', 'sitting') // returns 3
 * editDistance('teh', 'the', { swaps: true }) // returns 1
 * editDistance('banana', 'orange', { max: 2 }) // returns Infinity
 * editDistance('café', 'café') // returns 0 (NFC-normalized)
 * ```
 */
export function editDistance(a: unknown, b: unknown, options?: EditDistanceOptions): number;

/**
 * Scores how alike two strings read, 0..1, where 1 is identical — 1 minus the
 * edit distance over the longer string's length
 * `min` is a score floor that lets the comparison stop early and report 0
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#similarity similarity}
 * @see {@link https://next.semantic-ui.com/examples/utils-similarity Example}
 *
 * @param a - The first string (nullish reads as empty, other input is stringified)
 * @param b - The second string
 * @param options - Comparison options
 * @returns A score from 0 (nothing shared) to 1 (identical)
 *
 * @example
 * ```ts
 * similarity('kitten', 'sitting') // returns 0.571…
 * similarity('JavaScript', 'javascript', { ignoreCase: true }) // returns 1
 * similarity('abc', 'xyz', { min: 0.7 }) // returns 0 (early exit below the floor)
 * ```
 */
export function similarity(a: unknown, b: unknown, options?: SimilarityOptions): number;

/**
 * Suggests the nearest candidate to a mistyped word, or null when nothing reads
 * close enough — the lookup behind a did-you-mean teaching message
 * Returns the candidate verbatim, never prose, so the caller owns the sentence around it
 * Candidates read generously: an array or Set of names, a lone name, or the keys of a plain object or Map
 * @see {@link https://next.semantic-ui.com/docs/api/utils/strings#suggest suggest}
 * @see {@link https://next.semantic-ui.com/examples/utils-suggest Example}
 *
 * With `count`, returns the plausible candidates as an array instead, best-first,
 * up to `count` of them ([] when none) — same confidence gate. To rank everything
 * under an explicit edit cap, filter with {@link editDistance} and `max` instead
 *
 * @param word - The mistyped word (nullish reads as empty)
 * @param candidates - The known vocabulary to suggest from
 * @param options - Suggestion options
 * @returns The nearest candidate or null — with `count`, an array best-first
 *
 * @example
 * ```ts
 * suggest('stirng', ['string', 'number', 'boolean']) // returns 'string'
 * suggest('colr', { color: '#f00', size: 'large' }) // returns 'color' (object keys)
 * suggest('xyz', ['string', 'number']) // returns null
 * suggest('FORCE', ['force']) // returns 'force' (case reads as a typo)
 * suggest('stirng', ['strong', 'string'], { count: 3 }) // returns ['string', 'strong']
 * ```
 */
export function suggest(
  word: unknown,
  candidates: SuggestCandidates,
  options?: SuggestOptions & { count?: undefined; },
): string | null;
export function suggest(
  word: unknown,
  candidates: SuggestCandidates,
  options: SuggestOptions & { count: number; },
): string[];
