import { isArray, isBoolean, isDate, isNumber, isObject, isString } from './types.js';

/*-------------------
      Coercion
--------------------*/

// generous recognition of the common spellings, case-insensitive and trimmed. an unrecognized value
// coerces to null so the result composes with ?? (a schema passes it through, an app defaults it)
const TRUTHY_STRINGS = new Set(['true', 't', 'yes', 'y', 'on', 'enabled', 'enable']);
const FALSY_STRINGS = new Set(['false', 'f', 'no', 'n', 'off', 'disabled', 'disable', 'null', 'undefined', 'nan']);

// new Date reads '2024' or '1/2/24' as a date, so accept only ISO-8601 and reject ambiguous,
// locale-dependent spellings. a zoneless datetime resolves in the ambient zone (the user's on the
// client), returned as a UTC instant, matching what native new Date does with an <input type=datetime-local>
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

// fold -0 to 0 so a coerced value never trips Object.is or 1/x downstream
const normalizeZero = (number) => (number === 0 ? 0 : number);

export const toBoolean = (value, { falsy, loose = false } = {}) => {
  if (isBoolean(value)) { return value; }
  if (isNumber(value)) { return !Number.isNaN(value) && value !== 0; }
  if (isString(value)) {
    const normalized = value.trim().toLowerCase();
    // a caller's falsy tokens override everything, including the built-in truthy set
    if (falsy != null) {
      const tokens = isArray(falsy) ? falsy : [falsy];
      for (const token of tokens) {
        if (String(token).trim().toLowerCase() === normalized) { return false; }
      }
    }
    if (TRUTHY_STRINGS.has(normalized)) { return true; }
    if (FALSY_STRINGS.has(normalized)) { return false; }
    // a numeric string reads by its value ('1' -> true, '0'/'0.0' -> false)
    if (normalized !== '') {
      const asNumber = Number(normalized);
      if (!Number.isNaN(asNumber)) { return asNumber !== 0; }
    }
  }
  // unrecognized: null by default, native truthiness under loose
  return loose ? Boolean(value) : null;
};

export const toNumber = (value) => {
  // isNumber admits NaN and Infinity, both of which poison arithmetic, so only a finite number survives
  if (isNumber(value)) { return Number.isFinite(value) ? normalizeZero(value) : null; }
  if (isBoolean(value)) { return value ? 1 : 0; }
  if (isString(value)) {
    const trimmed = value.trim();
    if (trimmed === '') { return null; }
    const asNumber = Number(trimmed);
    return Number.isFinite(asNumber) ? normalizeZero(asNumber) : null;
  }
  return null;
};

export const toInteger = (value) => {
  const asNumber = toNumber(value);
  if (asNumber === null) { return null; }
  // Math.trunc carries the sign, so -0.5 lands on -0 without the normalize
  return normalizeZero(Math.trunc(asNumber));
};

export const toDate = (value) => {
  // isDate admits Invalid Date, so reject it explicitly. a poisoned Date must never escape
  if (isDate(value)) { return Number.isNaN(value.getTime()) ? null : value; }
  // numbers are epoch milliseconds. a timestamp passed as a string is rejected below, on purpose
  if (isNumber(value) && !Number.isNaN(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (isString(value)) {
    const trimmed = value.trim();
    if (!ISO_DATE_RE.test(trimmed)) { return null; }
    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) { return null; }
    // new Date rolls a bad day (2024-02-30 -> Mar 1), so confirm the calendar date round-trips.
    // setUTCFullYear avoids Date.UTC remapping a year of 0-99 into the 1900s
    const [year, month, day] = trimmed.slice(0, 10).split('-').map(Number);
    const probe = new Date(0);
    probe.setUTCFullYear(year, month - 1, day);
    if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) { return null; }
    return date;
  }
  return null;
};

export const toString = (value, { loose = false } = {}) => {
  if (isString(value)) { return value; }
  if (value == null) { return null; }
  // a non-finite number has no faithful string form, matching toNumber's rejection of NaN and Infinity
  if (isNumber(value)) { return Number.isFinite(value) ? String(value) : null; }
  if (isBoolean(value) || typeof value === 'bigint') { return String(value); }
  // loose opts into rendering objects and arrays for display, staying inside the never-throw contract
  if (loose && isObject(value)) {
    try {
      return JSON.stringify(value) ?? null;
    }
    catch {
      return null;
    }
  }
  return null; // objects without loose, plus functions and symbols
};

// coerceX aliases for callers who think in coercion terms (zod's z.coerce.*)
export const coerceBoolean = toBoolean;
export const coerceNumber = toNumber;
export const coerceInteger = toInteger;
export const coerceDate = toDate;
export const coerceString = toString;
