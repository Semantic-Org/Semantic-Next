/*-------------------
      Identity
--------------------*/

const WHITESPACE_RE = /\s+/g;
const NON_WORD_RE = /[^\w-]+/g;
const UNDERSCORE_RE = /_/g;

export const tokenize = (str = '') => {
  return (str || '').replace(WHITESPACE_RE, '-')
    .replace(NON_WORD_RE, '')
    .replace(UNDERSCORE_RE, '-')
    .toLowerCase();
};

export const prettifyHash = (numericHash, { minLength = 6, padChar = '0' } = {}) => {
  numericHash = parseInt(numericHash, 10);
  if (numericHash === 0) {
    return minLength > 1 ? padChar.repeat(minLength - 1) + '0' : '0';
  }

  let result = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (numericHash > 0) {
    result = chars[numericHash % chars.length] + result;
    numericHash = Math.floor(numericHash / chars.length);
  }

  // Pad if needed
  if (result.length < minLength) {
    result = padChar.repeat(minLength - result.length) + result;
  }

  return result;
};

/*-------------------
      Hashing
--------------------*/

const normalizeForHash = (input) => {
  if (input == null) {
    return '';
  }
  // only plain objects get JSON-serialized; Date/class instances keep their toString
  if (typeof input === 'object' && input.toString === Object.prototype.toString) {
    try {
      return JSON.stringify(input);
    }
    catch {
      return '';
    }
  }
  return String(input);
};

/*
  Deterministic 53-bit hash (cyrb53). Same input → same output, for cache keys,
  memo keys, and content identity. Not for unique ids — use generateID.
*/
export const hashCode = (input, { prettify = false, seed = 0 } = {}) => {
  const str = normalizeForHash(input);
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return prettify ? prettifyHash(hash) : hash;
};

/*-------------------
      Entropy
--------------------*/

export const getRandomSeed = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0];
};

// one bulk CSPRNG draw amortized across many ids — a per-call getRandomValues
// on a few bytes pays the full web-crypto overhead for almost no payload
const POOL_SIZE = 16384;
let entropyPool = null;
let poolPos = POOL_SIZE;
const randomByte = () => {
  if (poolPos >= POOL_SIZE) {
    entropyPool ??= new Uint8Array(POOL_SIZE);
    crypto.getRandomValues(entropyPool);
    poolPos = 0;
  }
  return entropyPool[poolPos++];
};

/*-------------------
      Identity codes
--------------------*/

// Crockford base32 — excludes I L O U (visual ambiguity, accidental profanity).
// 32 is a power of two, so byte & 31 samples it without modulo bias.
const BASE32 = '0123456789abcdefghjkmnpqrstvwxyz';
const BASE32_UPPER = BASE32.toUpperCase();
// the 22 letters, for a guaranteed-alpha first char (valid CSS identifier)
const ALPHA = 'abcdefghjkmnpqrstvwxyz';
const ALPHA_UPPER = ALPHA.toUpperCase();
// 256 - (256 % 22): bytes at or above this would bias the 22-letter draw
const ALPHA_CUTOFF = 242;

const randomCode = (alphabet) => alphabet[randomByte() & 31];

const randomAlpha = (letters) => {
  let byte;
  do {
    byte = randomByte();
  }
  while (byte >= ALPHA_CUTOFF);
  return letters[byte % 22];
};

// 48-bit ms clock, big-endian in 10 base32 chars — the ULID time component.
// Big-endian so lexicographic order is chronological order.
const encodeTime = (alphabet) => {
  let time = Date.now();
  let out = '';
  for (let i = 0; i < 10; i++) {
    out = alphabet[time % 32] + out;
    time = Math.floor(time / 32);
  }
  return out;
};

const decodeTime = (chars) => {
  let ms = 0;
  for (let i = 0; i < chars.length; i++) {
    ms = ms * 32 + BASE32_UPPER.indexOf(chars[i]);
  }
  return new Date(ms);
};

const RFC_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const uuidV7 = () => {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = randomByte();
  }
  const now = Date.now();
  bytes[0] = Math.floor(now / 2 ** 40);
  bytes[1] = Math.floor(now / 2 ** 32);
  bytes[2] = Math.floor(now / 2 ** 24);
  bytes[3] = Math.floor(now / 2 ** 16);
  bytes[4] = Math.floor(now / 2 ** 8);
  bytes[5] = now;
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  let hex = '';
  for (let i = 0; i < 16; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      hex += '-';
    }
  }
  return hex;
};

/*
  Preset contracts. length = total emitted chars after the prefix (a checksum,
  when on, spends the last slot so width stays constant per config).
  alphaFirst forces a letter lead for valid CSS identifiers. timestamp prepends
  the sortable ULID clock. upper emits canonical uppercase.
*/
const PRESETS = {
  db: { length: 26, timestamp: true, alphaFirst: false, checksum: false, upper: true },
  page: { length: 8, timestamp: false, alphaFirst: true, checksum: false, upper: false },
  slug: { length: 11, timestamp: false, alphaFirst: false, checksum: false, upper: false },
  token: { length: 27, timestamp: false, alphaFirst: false, checksum: true, upper: false },
};

// position-weighted sum over each char's base32 value (not its char code) so an
// adjacent swap shifts the sum by a - b, nonzero whenever the two differ — every
// adjacent transposition is caught. Weighting by position spreads substitutions.
// Computed over the case-folded prefix+body so a typo anywhere fails; prefix
// chars outside the alphabet fall back to their char code. Result is a base32
// index, so the check char is always URL/CSS-safe.
const charValue = (char) => {
  const value = BASE32_UPPER.indexOf(char);
  return value === -1 ? char.charCodeAt(0) : value;
};

const checksumValue = (canonical) => {
  let sum = 0;
  for (let i = 0; i < canonical.length; i++) {
    sum = (sum + charValue(canonical[i]) * (i + 1)) % 32;
  }
  return sum;
};

// accept loose: fold to the canonical uppercase form Crockford decodes to —
// I/L → 1, O → 0, lowercase → upper, hyphens dropped
const fold = (value) =>
  value
    .replace(/-/g, '')
    .toUpperCase()
    .replace(/[ILO]/g, (c) => (c === 'O' ? '0' : '1'));

const isBase32 = (folded) => {
  for (let i = 0; i < folded.length; i++) {
    if (BASE32_UPPER.indexOf(folded[i]) === -1) {
      return false;
    }
  }
  return true;
};

const group = (id, size) => {
  const parts = [];
  for (let i = 0; i < id.length; i += size) {
    parts.push(id.slice(i, i + size));
  }
  return parts.join('-');
};

const resolveConfig = (options) => {
  const globalConfig = generateID.config;
  const usage = options.usage ?? globalConfig.usage ?? 'db';
  const preset = PRESETS[usage];
  if (!preset) {
    throw new Error(`generateID: unknown usage '${usage}'`);
  }
  const pick = (key) => options[key] ?? globalConfig[key] ?? preset[key];
  return {
    usage,
    length: options.length ?? globalConfig.length ?? preset.length,
    prefix: options.prefix ?? globalConfig.prefix ?? '',
    checksum: pick('checksum'),
    format: options.format ?? globalConfig.format ?? 'crockford',
    group: options.group ?? globalConfig.group ?? false,
    timestamp: preset.timestamp,
    alphaFirst: preset.alphaFirst,
    upper: preset.upper,
  };
};

const buildCode = (config) => {
  const alphabet = config.upper ? BASE32_UPPER : BASE32;
  const bodyLength = config.checksum ? config.length - 1 : config.length;
  let body = '';
  if (config.timestamp) {
    body += encodeTime(alphabet);
  }
  else if (config.alphaFirst) {
    body += randomAlpha(config.upper ? ALPHA_UPPER : ALPHA);
  }
  while (body.length < bodyLength) {
    body += randomCode(alphabet);
  }
  let code = body;
  if (config.checksum) {
    const check = BASE32_UPPER[checksumValue(fold(config.prefix + body))];
    code += config.upper ? check : check.toLowerCase();
  }
  return config.group ? group(code, config.group) : code;
};

/*
  Generate a unique id. Defaults to a sortable 26-char ULID (usage 'db'). Pass
  a usage preset, an explicit length, a typed prefix, a trailing checksum, or
  format 'uuid' for an RFC UUIDv7. See isValidID / parseID for the inverse.
*/
export const generateID = (options = {}) => {
  // a bare number keeps the legacy seed-less call working as a short page id
  if (typeof options !== 'object' || options === null) {
    options = {};
  }
  const config = resolveConfig(options);
  if (config.format === 'uuid') {
    return config.prefix + uuidV7();
  }
  return config.prefix + buildCode(config);
};

// global defaults, lowest precedence (call options > config > preset)
generateID.config = {};

/*
  Offline validation — the cheap rejection before an expensive lookup. Reads
  loose (folds case, I/L → 1, O → 0, ignores hyphens), then checks prefix,
  length, alphabet, and checksum against the same config that would mint it.
*/
export const isValidID = (id, options = {}) => {
  if (typeof id !== 'string') {
    return false;
  }
  const config = resolveConfig(options);
  if (config.prefix && !id.startsWith(config.prefix)) {
    return false;
  }
  const afterPrefix = config.prefix ? id.slice(config.prefix.length) : id;

  if (config.format === 'uuid') {
    return RFC_UUID_RE.test(afterPrefix.toLowerCase());
  }

  const folded = fold(afterPrefix);
  if (folded.length !== config.length || !isBase32(folded)) {
    return false;
  }
  if (config.checksum) {
    const body = folded.slice(0, -1);
    const expected = BASE32_UPPER[checksumValue(fold(config.prefix + body))];
    if (folded.slice(-1) !== expected) {
      return false;
    }
  }
  return true;
};

/*
  Split a valid id into { prefix, body, checksum }, decoding timestamp for the
  db preset. Returns null for anything isValidID rejects — there is no in-band
  signal, so parsing always needs the config that minted it.
*/
export const parseID = (id, options = {}) => {
  if (!isValidID(id, options)) {
    return null;
  }
  const config = resolveConfig(options);
  const afterPrefix = config.prefix ? id.slice(config.prefix.length) : id;

  if (config.format === 'uuid') {
    return { prefix: config.prefix, body: afterPrefix, checksum: null };
  }

  const folded = fold(afterPrefix);
  const checksum = config.checksum ? folded.slice(-1) : null;
  const body = config.checksum ? folded.slice(0, -1) : folded;
  const result = { prefix: config.prefix, body, checksum };
  if (config.timestamp) {
    result.timestamp = decodeTime(body.slice(0, 10));
  }
  return result;
};
