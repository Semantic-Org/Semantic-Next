import { configured } from './functions.js';
import { isArray, isBinary, isBoolean, isDate, isNumber, isObject, isString } from './types.js';

/*-------------------
      Coercion
--------------------*/

// new Date reads '2024' or '1/2/24' as a date, so accept only ISO-8601 and reject ambiguous,
// locale-dependent spellings. a zoneless datetime resolves in the ambient zone (the user's on the
// client), returned as a UTC instant, matching what native new Date does with an <input type=datetime-local>
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

// one number, an optional space, one optional unit, mirroring the ecosystem's ms() and bytes(). a
// compound form like '1h 30m' is a different grammar and reads as junk here
const QUANTITY_RE = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*([a-z]*)$/i;

const textEncoder = /* @__PURE__ */ new TextEncoder();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

// fold -0 to 0 so a coerced value never trips Object.is or 1/x downstream
const normalizeZero = (number) => (number === 0 ? 0 : number);

// the return for a failed coercion. 'null' (the default) tames the value so the result composes with
// ??, 'passthrough' preserves the original so a downstream validator can flag the bad input instead of
// seeing an erasing null. a 'throw' mode can slot in here later without a new option
const onInvalidResult = (value, mode) => (mode === 'passthrough' ? value : null);

// case-insensitive, trimmed membership test against a token list (a single token or an array)
const matchesToken = (tokens, normalized) => {
  const list = isArray(tokens) ? tokens : [tokens];
  for (const token of list) {
    if (String(token).trim().toLowerCase() === normalized) { return true; }
  }
  return false;
};

// the editable boolean vocabulary and defaults, set once at app boot (toBoolean.config.truthy.push('oui'))
// and every call inherits it. per-call truthy/falsy/loose/onInvalid still win over these
export const toBoolean = /* @__PURE__ */ configured(
  (value, options = {}) => {
    const config = toBoolean.config;
    const loose = options.loose ?? config.loose;
    const onInvalid = options.onInvalid ?? config.onInvalid;
    if (isBoolean(value)) { return value; }
    if (isNumber(value)) { return !Number.isNaN(value) && value !== 0; }
    if (isString(value)) {
      const normalized = value.trim().toLowerCase();
      // per-call tokens win over the config vocabulary, and falsy wins over truthy within each layer,
      // so a token pushed into both config lists by separate boot-time extensions reads as false
      if (options.falsy != null && matchesToken(options.falsy, normalized)) { return false; }
      if (options.truthy != null && matchesToken(options.truthy, normalized)) { return true; }
      if (matchesToken(config.falsy, normalized)) { return false; }
      if (matchesToken(config.truthy, normalized)) { return true; }
      // a numeric string reads by its value ('1' -> true, '0'/'0.0' -> false)
      if (normalized !== '') {
        const asNumber = Number(normalized);
        if (!Number.isNaN(asNumber)) { return asNumber !== 0; }
      }
    }
    // unrecognized: truthiness under loose (loose wins over onInvalid), else the onInvalid result
    return loose ? Boolean(value) : onInvalidResult(value, onInvalid);
  },
  {
    truthy: ['true', 't', 'yes', 'y', 'on', 'enabled', 'enable'],
    falsy: ['false', 'f', 'no', 'n', 'off', 'disabled', 'disable', 'null', 'undefined', 'nan'],
    loose: false,
    onInvalid: 'null',
  },
);

export const toNumber = (value, { onInvalid = 'null' } = {}) => {
  // isNumber admits NaN and Infinity, both of which poison arithmetic, so only a finite number survives
  if (isNumber(value)) { return Number.isFinite(value) ? normalizeZero(value) : onInvalidResult(value, onInvalid); }
  if (isBoolean(value)) { return value ? 1 : 0; }
  if (isString(value)) {
    const trimmed = value.trim();
    if (trimmed === '') { return onInvalidResult(value, onInvalid); }
    const asNumber = Number(trimmed);
    return Number.isFinite(asNumber) ? normalizeZero(asNumber) : onInvalidResult(value, onInvalid);
  }
  return onInvalidResult(value, onInvalid);
};

export const toInteger = (value, { onInvalid = 'null' } = {}) => {
  // resolve failure with the default (null) toNumber so passthrough returns the original value here,
  // never Math.trunc's NaN artifact from truncating an uncoercible input
  const asNumber = toNumber(value);
  if (asNumber === null) { return onInvalidResult(value, onInvalid); }
  // Math.trunc carries the sign, so -0.5 lands on -0 without the normalize
  return normalizeZero(Math.trunc(asNumber));
};

export const toDate = (value, { onInvalid = 'null', epoch = 'milliseconds' } = {}) => {
  // isDate admits Invalid Date, so reject it explicitly. a poisoned Date must never escape
  if (isDate(value)) { return Number.isNaN(value.getTime()) ? onInvalidResult(value, onInvalid) : value; }
  // numbers are epoch milliseconds unless the caller declares seconds (a JWT exp, most unix
  // timestamps), where the ms reading would produce a valid but wrong date in 1970.
  // a timestamp passed as a string is rejected below, on purpose
  if (isNumber(value) && !Number.isNaN(value)) {
    const date = new Date(epoch === 'seconds' ? value * 1000 : value);
    return Number.isNaN(date.getTime()) ? onInvalidResult(value, onInvalid) : date;
  }
  if (isString(value)) {
    const trimmed = value.trim();
    if (!ISO_DATE_RE.test(trimmed)) { return onInvalidResult(value, onInvalid); }
    // hand the engine only the spec's form (T separator, colon offset). v8 happens to accept the
    // space form and a bare +0530, stricter engines do not, so acceptance must not ride on leniency
    const spec = trimmed.replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
    const date = new Date(spec);
    if (Number.isNaN(date.getTime())) { return onInvalidResult(value, onInvalid); }
    // new Date rolls a bad day (2024-02-30 -> Mar 1), so confirm the calendar date round-trips.
    // setUTCFullYear avoids Date.UTC remapping a year of 0-99 into the 1900s
    const [year, month, day] = trimmed.slice(0, 10).split('-').map(Number);
    const probe = new Date(0);
    probe.setUTCFullYear(year, month - 1, day);
    if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) { return onInvalidResult(value, onInvalid); }
    return date;
  }
  return onInvalidResult(value, onInvalid);
};

// only fixed-length spans are listed. a week is always 7 days, but a year is a pick (ms() reads it
// as 365.25 days) and a month has no length at all, so neither is guessed here. add one at boot with
// toDuration.config.units.y = 365 * 24 * 60 * 60 * 1000, where keys are matched lowercase
export const toDuration = /* @__PURE__ */ configured(
  (value, { onInvalid = 'null' } = {}) => {
    // a number is already milliseconds, the unit taken by timers, TTLs, and animation APIs
    if (isNumber(value)) { return Number.isFinite(value) ? normalizeZero(value) : onInvalidResult(value, onInvalid); }
    if (isString(value)) {
      const match = QUANTITY_RE.exec(value.trim());
      if (match) {
        const units = toDuration.config.units;
        const unit = match[2].toLowerCase() || 'ms';
        // an inherited key ('5constructor') or a 300-digit overflow would otherwise produce NaN or
        // Infinity, which this family never returns
        if (Object.hasOwn(units, unit)) {
          const milliseconds = Number(match[1]) * units[unit];
          if (Number.isFinite(milliseconds)) { return normalizeZero(milliseconds); }
        }
      }
    }
    return onInvalidResult(value, onInvalid);
  },
  {
    units: {
      ms: 1,
      msec: 1,
      msecs: 1,
      millisecond: 1,
      milliseconds: 1,
      s: SECOND,
      sec: SECOND,
      secs: SECOND,
      second: SECOND,
      seconds: SECOND,
      m: MINUTE,
      min: MINUTE,
      mins: MINUTE,
      minute: MINUTE,
      minutes: MINUTE,
      h: HOUR,
      hr: HOUR,
      hrs: HOUR,
      hour: HOUR,
      hours: HOUR,
      d: DAY,
      day: DAY,
      days: DAY,
      w: WEEK,
      week: WEEK,
      weeks: WEEK,
    },
  },
);

// values are exponents of the base, so kb/mb/gb follow one base knob and a new unit is one line
// (toByteSize.config.units.eb = 6). the IEC spellings are 1024-based by definition and sit in their own
// table so base can never move them. kb reading as 1024 is the judgment call, and it is the setting.
// abbreviations only, mirroring the ecosystem's bytes() where toDuration mirrors ms(): sizes in a
// config are spelled short, and every importer pays for each spelling in this table
export const toByteSize = /* @__PURE__ */ configured(
  (value, { onInvalid = 'null', base } = {}) => {
    // a number is already bytes, the unit every size API takes
    if (isNumber(value)) {
      return Number.isFinite(value)
        ? normalizeZero(Math.round(value))
        : onInvalidResult(value, onInvalid);
    }
    if (isString(value)) {
      const match = QUANTITY_RE.exec(value.trim());
      if (match) {
        const config = toByteSize.config;
        const unit = match[2].toLowerCase() || 'b';
        let scale;
        if (Object.hasOwn(config.units, unit)) { scale = Math.pow(base ?? config.base, config.units[unit]); }
        else if (Object.hasOwn(config.iecUnits, unit)) { scale = Math.pow(1024, config.iecUnits[unit]); }
        if (scale !== undefined) {
          // a byte is indivisible, so the count is whole. this also folds the float noise a decimal
          // multiplier leaves behind (1.1 * 1000000 is 1100000.0000000002)
          const bytes = Math.round(Number(match[1]) * scale);
          if (Number.isFinite(bytes)) { return normalizeZero(bytes); }
        }
      }
    }
    return onInvalidResult(value, onInvalid);
  },
  {
    base: 1024,
    units: { b: 0, kb: 1, mb: 2, gb: 3, tb: 4, pb: 5 },
    iecUnits: { kib: 1, mib: 2, gib: 3, tib: 4, pib: 5 },
  },
);

// a string reads as text (its UTF-8 bytes), never as an encoding. decoding is fromBase64's job, and
// the spelling that returns bytes from base64 is fromBase64(s, { as: 'bytes' })
export const toBytes = (value, { onInvalid = 'null' } = {}) => {
  if (isString(value)) { return textEncoder.encode(value); }
  if (value instanceof Uint8Array) { return value; }
  // a view shares its buffer and keeps its bounds, so no copy is made
  if (isBinary(value)) {
    return value instanceof ArrayBuffer
      ? new Uint8Array(value)
      : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (isArray(value)) {
    // Uint8Array would wrap [300] to 44 silently, which is no clean reading
    for (const byte of value) {
      if (!Number.isInteger(byte) || byte < 0 || byte > 255) { return onInvalidResult(value, onInvalid); }
    }
    return new Uint8Array(value);
  }
  // a bare number lands here on purpose, Uint8Array would read it as a LENGTH and encode zero-fill
  return onInvalidResult(value, onInvalid);
};

export const toString = (value, { loose = false, onInvalid = 'null' } = {}) => {
  if (isString(value)) { return value; }
  if (value == null) { return onInvalidResult(value, onInvalid); }
  // a non-finite number has no faithful string form, matching toNumber's rejection of NaN and Infinity
  if (isNumber(value)) { return Number.isFinite(value) ? String(value) : onInvalidResult(value, onInvalid); }
  if (isBoolean(value) || typeof value === 'bigint') { return String(value); }
  // loose opts into rendering objects and arrays for display, staying inside the never-throw contract
  if (loose && isObject(value)) {
    try {
      return JSON.stringify(value) ?? onInvalidResult(value, onInvalid);
    }
    catch {
      return onInvalidResult(value, onInvalid);
    }
  }
  return onInvalidResult(value, onInvalid); // objects without loose, plus functions and symbols
};

// coerceX aliases for callers who think in coercion terms (zod's z.coerce.*)
export const coerceBoolean = toBoolean;
export const coerceNumber = toNumber;
export const coerceInteger = toInteger;
export const coerceDate = toDate;
export const coerceDuration = toDuration;
export const coerceByteSize = toByteSize;
export const coerceBytes = toBytes;
export const coerceString = toString;
