import { isArray, isBoolean, isDate, isNumber, isObject, isString } from './types.js';

/*-------------------
      Coercion
--------------------*/

// new Date reads '2024' or '1/2/24' as a date, so accept only ISO-8601 and reject ambiguous,
// locale-dependent spellings. a zoneless datetime resolves in the ambient zone (the user's on the
// client), returned as a UTC instant, matching what native new Date does with an <input type=datetime-local>
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

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
// and every call inherits it. per-call truthy/falsy/loose/onInvalid still win over these. the
// pure-annotated Object.assign keeps the function and its config one droppable expression, so a
// bundle that only imports the other coercers carries neither
export const toBoolean = /* @__PURE__ */ Object.assign(
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
    config: {
      truthy: ['true', 't', 'yes', 'y', 'on', 'enabled', 'enable'],
      falsy: ['false', 'f', 'no', 'n', 'off', 'disabled', 'disable', 'null', 'undefined', 'nan'],
      loose: false,
      onInvalid: 'null',
    },
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
export const coerceString = toString;
