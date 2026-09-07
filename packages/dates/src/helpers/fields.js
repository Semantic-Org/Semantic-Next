import { isDevelopment, isNumber, isPlainObject, isString } from '@semantic-ui/utils';

import { guard, refuse, refuseType } from './errors.js';
import { IS_DURATION } from './identity.js';
import { isTemporalDuration, plural, unit } from './units.js';

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

const quantity = /(-?\d+(?:\.\d+)?)\s*([a-zµ]+)/g;

// '1h 30m', '2 weeks and 3 days', '90 minutes', '1500' (milliseconds, as toDuration reads it).
// a leading minus negates the whole phrase, the way a person means '-1h 30m'
const parseWords = (text) => {
  const phrase = text.trim().toLowerCase().replace(/,|\band\b/g, ' ');
  if (/^-?\d+(\.\d+)?$/.test(phrase)) {
    return { milliseconds: Number(phrase) };
  }
  const negate = phrase.startsWith('-');
  const fields = {};
  const rest = phrase.replace(negate ? phrase.slice(1) : phrase, (body) =>
    body.replace(quantity, (_, amount, name) => {
      spill(fields, unit(name), Number(amount));
      return '';
    }));
  if (rest.replace(/^-/, '').trim()) {
    refuse('unreadableDuration', text, {
      explanation: isDevelopment
        ? "write quantities with units, '1h 30m' or '2 weeks 3 days', or an ISO duration like PT1H30M"
        : 0,
    });
  }
  if (negate) {
    for (const field of Object.keys(fields)) {
      fields[field] = -fields[field];
    }
  }
  return fields;
};

// every shape a caller can hand to plus(), minus() or duration(), as plural Temporal fields
export const fieldsFrom = (input, name) => {
  if (input?.[IS_DURATION]) {
    return input.fields();
  }
  if (isTemporalDuration(input)) {
    return fieldsOf(input);
  }
  if (isNumber(input)) {
    return name === undefined ? { milliseconds: input } : spill({}, unit(name), input);
  }
  if (isString(input)) {
    return /^[-+]?P/i.test(input.trim())
      ? fieldsOf(guard(() => Temporal.Duration.from(input.trim()), 'unreadableDuration', input))
      : parseWords(input);
  }
  if (isPlainObject(input)) {
    const fields = {};
    for (const [key, value] of Object.entries(input)) {
      spill(fields, unit(key), value);
    }
    return fields;
  }
  return refuseType('notADuration', String(input), {
    explanation: isDevelopment
      ? "a duration is a number with a unit, a phrase like '2h 30m', an ISO string like PT2H30M, or a fields object"
      : 0,
  });
};

const clockFields = (fields) => {
  const clock = {};
  for (const field of fieldNames.slice(3)) {
    if (fields[field]) {
      clock[field] = fields[field];
    }
  }
  return clock;
};

// years, months and weeks stay field-wise, they have no fixed length to balance through. days and
// below combine through Temporal so a subtraction balances to one sign: 2h minus 30m is 1h 30m
export const addFields = (a, b, sign) => {
  const fields = {};
  for (const field of ['years', 'months', 'weeks']) {
    const sum = (a[field] ?? 0) + sign * (b[field] ?? 0);
    if (sum) {
      fields[field] = sum;
    }
  }
  const clockA = temporalDurationFrom(clockFields(a));
  const clockB = temporalDurationFrom(clockFields(b));
  Object.assign(fields, fieldsOf(sign > 0 ? clockA.add(clockB) : clockA.subtract(clockB)));
  const signs = new Set(Object.values(fields).map(Math.sign));
  if (signs.size > 1) {
    refuse('mixedSigns', JSON.stringify(fields), {
      explanation: isDevelopment
        ? 'a duration has one sign. subtract from a point instead: start.plus(months(1)).minus(days(3))'
        : 0,
    });
  }
  return fields;
};

// Temporal refuses an empty fields object, and a zero duration has no nonzero field to offer it
export const temporalDurationFrom = (
  fields,
) => (Object.keys(fields).length ? Temporal.Duration.from(fields) : new Temporal.Duration());

export const temporalDurationOf = (input, name) => temporalDurationFrom(fieldsFrom(input, name));

const looksLikeDuration = /^\s*(?:[-+]?P|-?\d+(?:\.\d+)?\s*[a-zµ])/i;

export const isDurationLike = (value) =>
  !!value?.[IS_DURATION] || isTemporalDuration(value) || isPlainObject(value)
  || (isString(value) && looksLikeDuration.test(value));
