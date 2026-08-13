/**
 * Cryptographic utility functions
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto Crypto Utilities Documentation}
 */

/**
 * A {@link hashCode} usage preset. Each names what the hash is for and carries
 * the default width and encoding for that intent.
 * - `hash` — in-heap keys: a 53-bit number (the default)
 * - `content` — keys that cross a boundary: a 64-bit Crockford string (the short tier; use `fingerprint` for large or growing sets)
 * - `fingerprint` — dedup and change detection: a 128-bit Crockford string
 * - `secure` — adversarial resistance: an async SHA-256 string (needs a secure context)
 */
export type HashUsage = 'hash' | 'content' | 'fingerprint' | 'secure';

/**
 * Output encoding for {@link hashCode}. Defaults per usage and can be overridden.
 * `number` is only valid for usages at or below the 53-bit safe-integer ceiling.
 */
export type HashFormat = 'number' | 'crockford' | 'hex';

type HashInput = string | number | boolean | object | null | undefined;

/**
 * Options for {@link hashCode}.
 */
interface HashCodeOptions {
  /**
   * What the hash is for. Sets the default width and encoding.
   * @default 'hash'
   */
  usage?: HashUsage;
  /**
   * Output encoding, overriding the usage default.
   */
  format?: HashFormat;
  /**
   * Namespacing seed. The same input under two seeds yields independent hashes.
   * @default 0
   */
  seed?: number;
  /**
   * Resolve as if no global `hashCode.config` were set — call options and
   * presets only. For library code that needs the same output shape regardless
   * of host-app defaults.
   * @default false
   */
  ignoreConfig?: boolean;
}

/**
 * Deterministic content hash. The same input always produces the same output.
 * Pick a usage by what the hash is for: `hash` for in-heap keys (a number),
 * `content` for short keys that cross a boundary, `fingerprint` for dedup and
 * change detection, `secure` for adversarial resistance (async SHA-256). `format`
 * overrides the encoding and `seed` namespaces the result. Set global defaults
 * via the mutable `hashCode.config`. For unique ids use {@link generateId}.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#hashcode hashCode}
 * @see {@link https://next.semantic-ui.com/examples/utils-hashcode Example}
 *
 * @param input - The value to hash. Plain objects are stringified via JSON.stringify; null and undefined become ""
 * @param options - Usage preset, encoding, and seed
 * @returns A 53-bit number (`hash`), an encoded string (`content` / `fingerprint`), or a `Promise<string>` (`secure`)
 *
 * @example
 * ```ts
 * hashCode('test')                                // 53-bit number
 * hashCode('test', { usage: 'content' })          // 64-bit crockford string
 * hashCode('test', { usage: 'fingerprint' })      // 128-bit crockford string
 * await hashCode('test', { usage: 'secure' })     // SHA-256 string
 * hashCode('test', { usage: 'content', format: 'hex' })
 * ```
 */
export function hashCode(input: HashInput, options?: HashCodeOptions & { usage?: 'hash'; format?: 'number'; }): number;
export function hashCode(input: HashInput, options: HashCodeOptions & { usage: 'secure'; }): Promise<string>;
export function hashCode(input: HashInput, options: HashCodeOptions): string;
export namespace hashCode {
  /** Global defaults, lowest precedence (call options > config > preset). */
  let config: Omit<HashCodeOptions, 'ignoreConfig'>;
}

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
 * A usage preset for {@link generateId}. Each names what the id is for and
 * carries the consensus length, alphabet, and structure for that channel.
 * - `db` — persisted records: 26-char sortable ULID (leaks creation time)
 * - `page` — DOM/CSS ids and ephemeral keys: 8 chars, always letter-first
 * - `link` — URLs and share links: 11 chars
 * - `token` — unguessable ids: 27 chars with a checksum, never timestamped
 * - `code` — human-typed codes (license, redemption, backup): 12 chars, uppercase, checksummed, grouped
 */
export type IdUsage = 'db' | 'page' | 'link' | 'token' | 'code';

/**
 * Options for {@link generateId}, {@link isValidId}, and {@link parseId}.
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
   * Defaults to the preset's setting (on for `token` and `code`).
   */
  checksum?: boolean;
  /**
   * Emit uppercase Crockford, overriding the preset's case (on for `db` and
   * `code`). Validation is case-insensitive either way.
   */
  upper?: boolean;
  /**
   * Output format. 'uuid' emits an RFC UUIDv7; the other Crockford options are
   * then ignored except `prefix`.
   * @default 'crockford'
   */
  format?: 'crockford' | 'uuid';
  /**
   * Hyphenate the output every n characters for display. Validation ignores the
   * hyphens. Defaults to the preset's setting (4 for `code`, off otherwise).
   */
  group?: number | false;
  /**
   * Resolve as if no global `generateId.config` were set — call options and
   * presets only. For library code whose id shapes must not bend to host-app
   * defaults. An id minted with it validates with it.
   * @default false
   */
  ignoreConfig?: boolean;
}

/**
 * The parsed parts of an id, from {@link parseId}.
 */
interface ParsedId {
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
 * format 'uuid' for an RFC UUIDv7. See {@link isValidId} / {@link parseId} for
 * the inverse. Override defaults globally via the mutable `generateId.config`.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#generateid generateId}
 * @see {@link https://next.semantic-ui.com/examples/utils-generateid Example}
 *
 * @param options - Usage preset and id-shape options
 * @returns The generated id string
 *
 * @example
 * ```ts
 * generateId()                                  // '01KV61ZF26Z6BG7T04NVKSPJ7K'
 * generateId({ usage: 'page' })                 // 'dzadahv3'
 * generateId({ usage: 'token', prefix: 'sk_' }) // 'sk_…' with checksum
 * generateId({ usage: 'code' })                 // 'ABCD-EFGH-JKLM' grouped, checksummed
 * generateId({ format: 'uuid' })                // RFC UUIDv7
 * ```
 */
export function generateId(options?: GenerateIDOptions): string;
export namespace generateId {
  /** Global defaults, lowest precedence (call options > config > preset). */
  let config: Omit<GenerateIDOptions, 'ignoreConfig'>;
}

/**
 * Offline validation — the cheap rejection before an expensive lookup. Reads
 * loose (folds case, I/L → 1, O → 0, ignores hyphens), then checks prefix,
 * length, alphabet, and checksum against the same config that would mint it.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#isvalidid isValidId}
 *
 * @param id - The id to validate
 * @param options - The same options used to generate it
 * @returns Whether the id is well-formed for that config
 *
 * @example
 * ```ts
 * isValidId(id, { usage: 'token', prefix: 'sk_' })
 * ```
 */
export function isValidId(id: string, options?: GenerateIDOptions): boolean;

/**
 * Split a valid id into its parts, decoding the timestamp for the `db` preset.
 * Returns null for anything {@link isValidId} rejects. There is no in-band
 * signal, so parsing always needs the config that minted the id.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/crypto#parseid parseId}
 *
 * @param id - The id to parse
 * @param options - The same options used to generate it
 * @returns The parsed parts, or null if invalid
 *
 * @example
 * ```ts
 * parseId(id, { usage: 'db' }) // { prefix, body, checksum, timestamp }
 * ```
 */
export function parseId(id: string, options?: GenerateIDOptions): ParsedId | null;
