import { isDevelopment, isNumber, isPlainObject, isString } from '@semantic-ui/utils';

import { refuse } from './errors.js';

if (!globalThis.Temporal) {
  refuse('noTemporal', 'globalThis.Temporal', {
    explanation: isDevelopment
      ? 'this library wraps the Temporal API. load a polyfill before importing it on a runtime without one'
      : 0,
  });
}

export const inspect = Symbol.for('nodejs.util.inspect.custom');

// every spelling toDuration in @semantic-ui/utils reads, plus the calendar units it refuses to guess at
const spellings = {
  y: 'year',
  yr: 'year',
  yrs: 'year',
  year: 'year',
  years: 'year',
  q: 'quarter',
  qtr: 'quarter',
  quarter: 'quarter',
  quarters: 'quarter',
  mo: 'month',
  mos: 'month',
  month: 'month',
  months: 'month',
  w: 'week',
  wk: 'week',
  wks: 'week',
  week: 'week',
  weeks: 'week',
  d: 'day',
  day: 'day',
  days: 'day',
  h: 'hour',
  hr: 'hour',
  hrs: 'hour',
  hour: 'hour',
  hours: 'hour',
  m: 'minute',
  min: 'minute',
  mins: 'minute',
  minute: 'minute',
  minutes: 'minute',
  s: 'second',
  sec: 'second',
  secs: 'second',
  second: 'second',
  seconds: 'second',
  ms: 'millisecond',
  msec: 'millisecond',
  msecs: 'millisecond',
  millisecond: 'millisecond',
  milliseconds: 'millisecond',
  us: 'microsecond',
  'µs': 'microsecond',
  microsecond: 'microsecond',
  microseconds: 'microsecond',
  ns: 'nanosecond',
  nanosecond: 'nanosecond',
  nanoseconds: 'nanosecond',
};

export const units = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
  'microsecond',
  'nanosecond',
];
export const timeUnits = ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];

// a number written as text, the way a form or a query string carries one
export const isDigits = (value) => isString(value) && /^\s*[-+]?\d+(?:\.\d+)?\s*$/.test(value);

// day.js keeps M for month and m for minute, and the tokens here do too, so the one capital is kept
export const unit = (input) => {
  const key = input === 'M' ? 'month' : isString(input) ? input.trim().toLowerCase() : '';
  const found = Object.hasOwn(spellings, key) && spellings[key];
  return found || refuse('unknownUnit', String(input), {
    explanation: isDevelopment
      ? `units are ${units.join(', ')} or quarter, singular or plural, or an abbreviation like h, min, d`
      : 0,
  });
};

export const plural = (name) => `${name}s`;

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// ISO numbering, monday is 1 and sunday is 7
export const weekdayNumber = (input) => {
  if (isNumber(input) && Number.isInteger(input) && input >= 1 && input <= 7) {
    return input;
  }
  const key = isString(input) ? input.trim().toLowerCase().slice(0, 3) : '';
  const index = key.length === 3 ? weekdays.findIndex((name) => name.startsWith(key)) : -1;
  return index === -1
    ? refuse('unknownWeekday', String(input), {
      explanation: isDevelopment ? `weekdays are ${weekdays.join(', ')} or 1 through 7 from monday` : 0,
    })
    : index + 1;
};

export const isZonedDateTime = (value) => value instanceof Temporal.ZonedDateTime;
export const isInstant = (value) => value instanceof Temporal.Instant;
export const isPlainDate = (value) => value instanceof Temporal.PlainDate;
export const isPlainDateTime = (value) => value instanceof Temporal.PlainDateTime;
export const isPlainTime = (value) => value instanceof Temporal.PlainTime;
export const isTemporalDuration = (value) => value instanceof Temporal.Duration;

export const pad = (value, width = 2) => String(Math.abs(value)).padStart(width, '0');

// Temporal truncates 9.5 to 9 before it checks a range, so a fraction is refused before it gets there
export const wholeNumbers = (values) => values.every((value) => !isNumber(value) || Number.isInteger(value));

// set() replaces parts as strictly as a factory reads them: whole numbers, in range
export const withParts = (temporal, changes) => {
  if (!wholeNumbers(Object.values(changes))) {
    throw new RangeError('a part is a whole number');
  }
  return temporal.with(changes, { overflow: 'reject' });
};

export const ordinal = (number) => {
  const tens = number % 100;
  const suffix = tens >= 11 && tens <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][number % 10] ?? 'th';
  return `${number}${suffix}`;
};

// singular keys, the shape Temporal's with() takes, from any spelling a caller wrote
export const singularKeys = (fields) => {
  const out = {};
  for (const [key, value] of Object.entries(fields)) {
    out[unit(key)] = value;
  }
  return out;
};

export const quarterStart = (month) => Math.floor((month - 1) / 3) * 3 + 1;

// one whole unit as duration fields
export const stepOf = (name) => (name === 'quarter' ? { months: 3 } : { [plural(name)]: 1 });

// the second argument of a factory is a zone, or an options bag { zone, loose }
export const zoneOptions = (value) => (isPlainObject(value) ? value : { zone: value });
