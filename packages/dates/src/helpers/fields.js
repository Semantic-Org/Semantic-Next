import { isDevelopment, isNumber, isPlainObject, isString } from '@semantic-ui/utils';

import { guard, refuse, refuseType } from './errors.js';
import { IS_DURATION } from './identity.js';
import { isDigits, isTemporalDuration, plural, unit } from './units.js';

export const fieldNames = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds',
];

// a fractional quantity spills into the next unit down: 1.5 days is a day and 12 hours. a month has no
// next unit, so a fraction of one is refused rather than guessed
const spillsInto = {
  year: ['month', 12],
  week: ['day', 7],
  day: ['hour', 24],
  hour: ['minute', 60],
  minute: ['second', 60],
  second: ['millisecond', 1000],
  millisecond: ['microsecond', 1000],
  microsecond: ['nanosecond', 1000],
};

export const spill = (fields, name, value) => {
  if (name === 'quarter') {
    return spill(fields, 'month', value * 3);
  }
  if (!Number.isFinite(value)) {
    refuse('notFinite', `${value} ${name}`);
  }
  const whole = Math.trunc(value);
  const fraction = Number((value - whole).toFixed(9));
  fields[plural(name)] = (fields[plural(name)] ?? 0) + whole;
  if (fraction) {
    const next = spillsInto[name];
    if (!next) {
      refuse('fractionalMonth', `${value} ${name}`, {
        explanation: isDevelopment
          ? 'months and nanoseconds have no smaller unit to spill into. write whole months, or days'
          : 0,
      });
    }
    spill(fields, next[0], Number((fraction * next[1]).toFixed(9)));
  }
  return fields;
};

// the nonzero fields of a Temporal.Duration as a plain object
export const fieldsOf = (temporal) => {
  const fields = {};
  for (const field of fieldNames) {
    if (temporal[field]) {
      fields[field] = temporal[field];
    }
  }
  return fields;
};

const quantity = /([-+]?)(\d+(?:\.\d+)?)\s*([a-zµ]+)/gi;

// '1h 30m', '2 weeks and 3 days', '90 minutes', '1500' (milliseconds, as toDuration reads it).
// a leading minus with the rest unsigned negates the whole phrase, the way a person means '-1h 30m',
// and a sign on each quantity is taken as written
const parseWords = (text) => {
  const phrase = text.trim().replace(/,|\band\b/gi, ' ');
  if (!phrase) {
    refuse('unreadableDuration', text, {
      explanation: isDevelopment ? 'an empty string is not a length. duration(0) is zero' : 0,
    });
  }
  if (/^-?\d+(\.\d+)?$/.test(phrase)) {
    return spill({}, 'millisecond', Number(phrase));
  }
  const found = [];
  const rest = phrase.replace(quantity, (_, sign, amount, name) => {
    found.push([sign, Number(amount), unit(name)]);
    return '';
  });
  if (rest.trim()) {
    refuse('unreadableDuration', text, {
      explanation: isDevelopment
        ? "write quantities with units, '1h 30m' or '2 weeks 3 days', or an ISO duration like PT1H30M"
        : 0,
    });
  }
  const negateAll = found[0]?.[0] === '-' && found.slice(1).every(([sign]) => sign === '');
  const fields = {};
  for (const [sign, amount, name] of found) {
    spill(fields, name, negateAll || sign === '-' ? -amount : amount);
  }
  return fields;
};

// a duration has one sign. '1h -30m' has no meaning until it is subtracted from a point
const oneSign = (fields, at) => {
  const signs = new Set(Object.values(fields).filter(Boolean).map(Math.sign));
  if (signs.size > 1) {
    refuse('mixedSigns', at, {
      explanation: isDevelopment
        ? 'a duration has one sign. subtract from a point instead: start.plus(months(1)).minus(days(3))'
        : 0,
    });
  }
  return fields;
};

// every shape a duration can be written as, as plural Temporal fields
export const fieldsFrom = (input, name) => {
  if (input?.[IS_DURATION]) {
    if (name !== undefined) {
      refuseType('notADuration', `${input} ${name}`, {
        explanation: isDevelopment
          ? "a duration already has its units. a unit goes with a number: duration(90, 'minutes')"
          : 0,
      });
    }
    return input.toFields();
  }
  if (isTemporalDuration(input)) {
    return fieldsOf(input);
  }
  if (isNumber(input)) {
    return spill({}, name === undefined ? 'millisecond' : unit(name), input);
  }
  if (isString(input)) {
    // a count from a form or a query string is text, and '30' beside 'days' is thirty days
    if (name !== undefined && isDigits(input)) {
      return spill({}, unit(name), Number(input));
    }
    return /^[-+]?P/i.test(input.trim())
      ? fieldsOf(guard(() => Temporal.Duration.from(input.trim()), 'unreadableDuration', input))
      : oneSign(parseWords(input), input);
  }
  if (isPlainObject(input)) {
    const fields = {};
    for (const [key, value] of Object.entries(input)) {
      spill(fields, unit(key), value);
    }
    return oneSign(fields, JSON.stringify(input));
  }
  return refuseType('notADuration', String(input), {
    explanation: isDevelopment
      ? "a duration is a number with a unit, a phrase like '2h 30m', an ISO string like PT2H30M, or a fields object"
      : 0,
  });
};

export const clockFields = (fields) => {
  const clock = {};
  for (const field of fieldNames.slice(4)) {
    if (fields[field]) {
      clock[field] = fields[field];
    }
  }
  return clock;
};

// years, months, weeks and days stay field-wise: they are calendar units, and folding 25 hours into a
// day would move a deadline across a daylight saving change. hours and below combine through Temporal
// so a subtraction balances to one sign: 2h minus 30m is 1h 30m
export const addFields = (a, b, sign) => {
  const fields = {};
  for (const field of ['years', 'months', 'weeks', 'days']) {
    const sum = (a[field] ?? 0) + sign * (b[field] ?? 0);
    if (sum) {
      fields[field] = sum;
    }
  }
  const clockA = temporalDurationOf(clockFields(a));
  const clockB = temporalDurationOf(clockFields(b));
  Object.assign(fields, fieldsOf(sign > 0 ? clockA.add(clockB) : clockA.subtract(clockB)));
  return oneSign(fields, JSON.stringify(fields));
};

// Temporal refuses an empty fields object, and a zero duration has no nonzero field to offer it
export const temporalDurationOf = (fields) =>
  Object.keys(fields).length
    ? guard(() => Temporal.Duration.from(fields), 'unreadableDuration', JSON.stringify(fields))
    : new Temporal.Duration();

export const temporalDurationFrom = (input, name) => temporalDurationOf(fieldsFrom(input, name));

// plural keys are how Temporal writes a length, singular keys how it writes a point, so { hours: 2 }
// is two hours where { hour: 2 } is two o'clock
export const isDurationFields = (value) =>
  isPlainObject(value) && Object.keys(value).length > 0 && Object.keys(value).every((key) => fieldNames.includes(key));
