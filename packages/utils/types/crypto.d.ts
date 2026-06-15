/**
 * Cryptographic utility functions
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto Crypto Utilities Documentation}
 */

/**
 * Converts a string to a URL-friendly token
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#tokenize tokenize}
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
 * Options for the `prettifyHash` function.
 */
interface PrettifyHashOptions {
  /**
   * Minimum length of the output string. Will pad with padChar if necessary.
   * @default 6
   */
  minLength?: number;
  /**
   * Character to use for padding.
   * @default '0'
   */
  padChar?: string;
}

/**
 * Converts a numeric hash value to a prettified alphanumeric string using base-36 encoding
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#prettifyhash prettifyHash}
 * @see {@link https://next.semantic-ui.com/examples/utils-prettifyhash Example}
 *
 * @param numericHash - The numeric hash value to convert
 * @param options - Options for prettifying the hash
 * @returns The prettified hash string. Returns padded "0" if input parses to 0 or NaN
 *
 * @example
 * ```ts
 * prettifyHash(123) // returns '00003F'
 * prettifyHash(123, { minLength: 8 }) // returns '0000003F'
 * prettifyHash(123, { minLength: 4, padChar: 'X' }) // returns 'XX3F'
 * ```
 */
export function prettifyHash(numericHash: number, options?: PrettifyHashOptions): string;

/**
 * Options for the `hashCode` function.
 */
interface HashCodeOptions {
  /**
   * Whether to prettify the resulting hash (convert to a base-36 string).
   * @default false
   */
  prettify?: boolean;
  /**
   * A seed value for the hash function.
   * @default 0
   */
  seed?: number;
}

/**
 * Deterministic 53-bit hash (cyrb53) of the given input. The same input always
 * produces the same value — use it for cache keys, memo keys, and content
 * identity, not for unique ids (use {@link generateID}).
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#hashcode hashCode}
 * @see {@link https://next.semantic-ui.com/examples/utils-hashcode Example}
 *
 * @param input - The input string or object. Plain objects are stringified via JSON.stringify; null and undefined become ""
 * @param options - Options for the hash function
 * @returns A 53-bit integer hash, or a prettified base-36 string when prettify is true
 *
 * @example
 * ```ts
 * hashCode('test')
 * hashCode('test', { prettify: true })
 * hashCode({ a: 1 }, { seed: 42 })
 * ```
 */
export function hashCode(input: string | object | null | undefined, options?: HashCodeOptions): number | string;

/**
 * Generates a cryptographically secure random 32-bit seed via crypto.getRandomValues.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#getrandomseed getRandomSeed}
 * @see {@link https://next.semantic-ui.com/examples/utils-getrandomseed Example}
 *
 * @returns A random 32-bit unsigned integer
 *
 * @example
 * ```ts
 * getRandomSeed() // 2949673445
 * ```
 */
export function getRandomSeed(): number;

/**
 * A usage preset for {@link generateID}. Each names what the id is for and
 * carries the consensus length, alphabet, and structure for that channel.
 * - `db` — persisted records: 26-char sortable ULID (leaks creation time)
 * - `page` — DOM/CSS ids and ephemeral keys: 8 chars, always letter-first
 * - `slug` — URLs and share links: 11 chars
 * - `token` — unguessable ids: 27 chars with a checksum, never timestamped
 */
export type IdUsage = 'db' | 'page' | 'slug' | 'token';

/**
 * Options for {@link generateID}, {@link isValidID}, and {@link parseID}.
 */
interface GenerateIDOptions {
  /**
   * The usage preset.
   * @default 'db'
   */
  usage?: IdUsage;
  /**
   * Total emitted characters after the prefix. Overrides the preset width. A
   * checksum, when on, spends the last character so width stays constant.
   */
  length?: number;
  /**
   * A verbatim prefix (typed-id convention, e.g. 'usr_'). Not counted in length.
   */
  prefix?: string;
  /**
   * Append a trailing checksum character that catches transcription typos.
   * Defaults to the preset's setting (on for `token`).
   */
  checksum?: boolean;
  /**
   * Output format. 'uuid' emits an RFC UUIDv7; the other Crockford options are
   * then ignored except `prefix`.
   * @default 'crockford'
   */
  format?: 'crockford' | 'uuid';
  /**
   * Hyphenate the output every n characters for display. Validation ignores the hyphens.
   * @default false
   */
  group?: number | false;
}

/**
 * The parsed parts of an id, from {@link parseID}.
 */
interface ParsedID {
  /** The prefix, or '' if none */
  prefix: string;
  /** The id body, without prefix or checksum */
  body: string;
  /** The checksum character, or null if the config is not checksummed */
  checksum: string | null;
  /** Decoded creation time, present only for the timestamped `db` preset */
  timestamp?: Date;
}

/**
 * Generate a unique id. Defaults to a sortable 26-char ULID (usage `db`). Pass
 * a usage preset, an explicit length, a typed prefix, a trailing checksum, or
 * format 'uuid' for an RFC UUIDv7. See {@link isValidID} / {@link parseID} for
 * the inverse. Override defaults globally via the mutable `generateID.config`.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#generateid generateID}
 * @see {@link https://next.semantic-ui.com/examples/utils-generateid Example}
 *
 * @param options - Usage preset and id-shape options
 * @returns The generated id string
 *
 * @example
 * ```ts
 * generateID()                                  // '01KV61ZF26Z6BG7T04NVKSPJ7K'
 * generateID({ usage: 'page' })                 // 'dzadahv3'
 * generateID({ usage: 'token', prefix: 'sk_' }) // 'sk_…' with checksum
 * generateID({ format: 'uuid' })                // RFC UUIDv7
 * ```
 */
export function generateID(options?: GenerateIDOptions): string;
export namespace generateID {
  /** Global defaults, lowest precedence (call options > config > preset). */
  let config: GenerateIDOptions;
}

/**
 * Offline validation — the cheap rejection before an expensive lookup. Reads
 * loose (folds case, I/L → 1, O → 0, ignores hyphens), then checks prefix,
 * length, alphabet, and checksum against the same config that would mint it.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#isvalidid isValidID}
 *
 * @param id - The id to validate
 * @param options - The same options used to generate it
 * @returns Whether the id is well-formed for that config
 *
 * @example
 * ```ts
 * isValidID(id, { usage: 'token', prefix: 'sk_' })
 * ```
 */
export function isValidID(id: string, options?: GenerateIDOptions): boolean;

/**
 * Split a valid id into its parts, decoding the timestamp for the `db` preset.
 * Returns null for anything {@link isValidID} rejects. There is no in-band
 * signal, so parsing always needs the config that minted the id.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#parseid parseID}
 *
 * @param id - The id to parse
 * @param options - The same options used to generate it
 * @returns The parsed parts, or null if invalid
 *
 * @example
 * ```ts
 * parseID(id, { usage: 'db' }) // { prefix, body, checksum, timestamp }
 * ```
 */
export function parseID(id: string, options?: GenerateIDOptions): ParsedID | null;
