/*-------------------
      Alphabets
--------------------*/

// Crockford base32, excludes I L O U for visual clarity and to dodge accidental
// profanity. Shared by the hash encoders here and the id codes further down.
const BASE32 = '0123456789abcdefghjkmnpqrstvwxyz';
const BASE32_UPPER = BASE32.toUpperCase();
const HEX = '0123456789abcdef';

/*-------------------
      Hashing
--------------------*/

const normalizeForHash = (input) => {
  if (input == null) {
    return '';
  }
  // only plain objects get JSON-serialized. Date/class instances keep their toString
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

// cyrb53 (bryc) is a fast hash with good avalanche. The seed shifts the whole
// sequence, so two seeds over one input give independent values — that is how
// fingerprint reaches its width without a second algorithm. The two 32-bit lanes
// carry 64 bits: the number form caps at 53 to stay exact in a JS number, the
// string forms spend all 64.
const cyrb53Lanes = (str, seed = 0) => {
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
  return [h1 >>> 0, h2 >>> 0];
};

const cyrb53 = (str, seed = 0) => {
  const [h1, h2] = cyrb53Lanes(str, seed);
  return 4294967296 * (2097151 & h2) + h1;
};

// the full 64 bits as 8 bytes, big-endian, for the string tiers
const cyrb64Bytes = (str, seed = 0) => {
  const [h1, h2] = cyrb53Lanes(str, seed);
  return [
    (h2 >>> 24) & 255,
    (h2 >>> 16) & 255,
    (h2 >>> 8) & 255,
    h2 & 255,
    (h1 >>> 24) & 255,
    (h1 >>> 16) & 255,
    (h1 >>> 8) & 255,
    h1 & 255,
  ];
};

// crockford base32 of a byte array, 5 bits at a time. value is drained below 5
// bits before each new byte, so the running shifts never overflow.
const bytesToBase32 = (bytes) => {
  let out = '';
  let bits = 0;
  let value = 0;
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += BASE32[(value >>> bits) & 31];
    }
    value &= (1 << bits) - 1;
  }
  if (bits > 0) {
    out += BASE32[(value << (5 - bits)) & 31];
  }
  return out;
};

const bytesToHex = (bytes) => {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += HEX[bytes[i] >> 4] + HEX[bytes[i] & 15];
  }
  return out;
};

// SubtleCrypto only exists in a secure context, so secure throws rather than
// silently dropping to a weaker hash.
const sha256 = async (str, seed) => {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("hashCode: usage 'secure' needs a secure context (https or localhost)");
  }
  const body = new TextEncoder().encode(str);
  let data = body;
  // salt with a fixed-width binary seed prefix so input content can't spoof it
  // (the old `${seed}:` form let '5:foo' at seed 0 collide with 'foo' at seed 5).
  // seed 0 stays unsalted, so it's a plain SHA-256 of the input.
  if (seed) {
    data = new Uint8Array(body.length + 4);
    data[0] = seed >>> 24;
    data[1] = seed >>> 16;
    data[2] = seed >>> 8;
    data[3] = seed;
    data.set(body, 4);
  }
  return new Uint8Array(await subtle.digest('SHA-256', data));
};

/*
  Usage presets. usage names what the hash is for and the default encoding. bits
  is the width, which decides one cyrb53 pass or two and bars the 'number' format
  above the 53-bit safe-integer ceiling. content's 64 bits is the short boundary
  key, fingerprint's 128 the collision-safe one for large or growing sets. secure
  is the only async, crypto rung.
*/
const HASH_PRESETS = {
  hash: { bits: 53, format: 'number' },
  content: { bits: 64, format: 'crockford' },
  fingerprint: { bits: 128, format: 'crockford' },
  secure: { bits: 256, format: 'crockford' },
};
const HASH_FORMATS = new Set(['number', 'crockford', 'hex']);

const resolveHashConfig = (options) => {
  const globalConfig = hashCode.config;
  const usage = options.usage ?? globalConfig.usage ?? 'hash';
  const preset = HASH_PRESETS[usage];
  if (!preset) {
    throw new Error(`hashCode: unknown usage '${usage}'`);
  }
  const format = options.format ?? globalConfig.format ?? preset.format;
  if (!HASH_FORMATS.has(format)) {
    throw new Error(`hashCode: unknown format '${format}'`);
  }
  // a hash wider than 53 bits can't round-trip through a JS number, so fail loud
  if (format === 'number' && preset.bits > 53) {
    throw new Error(`hashCode: format 'number' can't hold the '${usage}' hash`);
  }
  return { usage, format, seed: options.seed ?? globalConfig.seed ?? 0, bits: preset.bits };
};

/*
  Deterministic content hash, same input same output. Pick a usage by what the
  hash is for, not by algorithm:
    hash         53-bit number for in-heap keys (the default)
    content      64-bit crockford string for keys that leave the heap
    fingerprint  128-bit crockford string for dedup and change detection
    secure       async SHA-256 string for adversarial resistance
  format overrides the encoding ('crockford' | 'hex' | 'number'), seed namespaces
  the output, and hashCode.config sets global defaults. For unique ids that are
  not derived from content, use generateId.
*/
export const hashCode = (input, options = {}) => {
  const config = resolveHashConfig(options);
  const str = normalizeForHash(input);

  if (config.usage === 'secure') {
    return sha256(str, config.seed).then((bytes) => config.format === 'hex' ? bytesToHex(bytes) : bytesToBase32(bytes));
  }

  if (config.format === 'number') {
    return cyrb53(str, config.seed);
  }
  // string tiers spend the full 64 bits per pass; fingerprint adds a second
  // seeded pass for 128
  let bytes = cyrb64Bytes(str, config.seed);
  if (config.bits > 64) {
    bytes = bytes.concat(cyrb64Bytes(str, config.seed + 1));
  }
  return config.format === 'hex' ? bytesToHex(bytes) : bytesToBase32(bytes);
};

// global defaults, lowest precedence (call options > config > preset). mirrors generateId.config
hashCode.config = {};

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

// the 22 letters, for a guaranteed-alpha first char (valid CSS identifier)
const ALPHA = 'abcdefghjkmnpqrstvwxyz';
const ALPHA_UPPER = ALPHA.toUpperCase();
// 256 - (256 % 22): bytes at or above this would bias the 22-letter draw
const ALPHA_CUTOFF = 242;

// 32 is a power of two, so byte & 31 samples the alphabet with no modulo bias
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
  the sortable ULID clock. upper emits uppercase. group sets a default display
  grouping. code is the read-aloud tier: short, uppercase, checksummed, grouped.
*/
const PRESETS = {
  db: { length: 26, timestamp: true, alphaFirst: false, checksum: false, upper: true },
  page: { length: 8, timestamp: false, alphaFirst: true, checksum: false, upper: false },
  link: { length: 11, timestamp: false, alphaFirst: false, checksum: false, upper: false },
  token: { length: 27, timestamp: false, alphaFirst: false, checksum: true, upper: false },
  code: { length: 12, timestamp: false, alphaFirst: false, checksum: true, upper: true, group: 4 },
};

// position-weighted sum over each char's base32 value (not its char code) so an
// adjacent swap shifts the sum by a - b, nonzero whenever the two differ — every
// adjacent transposition is caught. Weighting by position spreads substitutions.
// Computed over the case-folded prefix+body so a typo anywhere fails. prefix
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
// I/L → 1, O → 0, lowercase → upper, hyphens dropped. The uppercase pass is
// ASCII-only on purpose: String.toUpperCase() expands a handful of code points
// (ß → SS, ﬀ → FF, …) into extra valid base32 letters, which would let a short
// string fold up to a passing length. Untouched non-ascii then fails isBase32.
const fold = (value) =>
  value
    .replace(/-/g, '')
    .replace(/[a-z]/g, (c) => c.toUpperCase())
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
  const globalConfig = generateId.config;
  const usage = options.usage ?? globalConfig.usage ?? 'db';
  const preset = PRESETS[usage];
  if (!preset) {
    throw new Error(`generateId: unknown usage '${usage}'`);
  }
  const pick = (key) => options[key] ?? globalConfig[key] ?? preset[key];
  const length = options.length ?? globalConfig.length ?? preset.length;
  // a timestamped id is at least the 10-char clock plus a random char, so a
  // shorter length is incoherent — fail loud rather than emit an id that can't
  // round-trip through isValidId
  if (preset.timestamp && length < 11) {
    throw new Error(`generateId: length must be at least 11 for usage '${usage}'`);
  }
  return {
    usage,
    length,
    prefix: options.prefix ?? globalConfig.prefix ?? '',
    checksum: pick('checksum'),
    upper: pick('upper'),
    format: options.format ?? globalConfig.format ?? 'crockford',
    group: pick('group') ?? false,
    timestamp: preset.timestamp,
    alphaFirst: preset.alphaFirst,
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
  format 'uuid' for an RFC UUIDv7. See isValidId / parseId for the inverse.
*/
export const generateId = (options = {}) => {
  // tolerate a non-object arg (null, or a leftover legacy numeric seed) instead
  // of throwing in resolveConfig — it falls through to the default usage
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
generateId.config = {};

/*
  Offline validation — the cheap rejection before an expensive lookup. Reads
  loose (folds case, I/L → 1, O → 0, ignores hyphens), then checks prefix,
  length, alphabet, and checksum against the same config that would mint it.
*/
export const isValidId = (id, options = {}) => {
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
  db preset. Returns null for anything isValidId rejects — there is no in-band
  signal, so parsing always needs the config that minted it.
*/
export const parseId = (id, options = {}) => {
  if (!isValidId(id, options)) {
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
