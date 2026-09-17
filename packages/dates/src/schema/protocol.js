import { isDate, isDevelopment } from '@semantic-ui/utils';

import { CalendarDate } from '../calendar-date.js';
import { DateTime } from '../date-time.js';
import { Duration } from '../duration.js';
import { refuse } from '../helpers/errors.js';
import { DateRange, DateTimeRange, TimeRange } from '../range.js';
import { Time } from '../time.js';

// the key each class carries its Type under, a Symbol.for so every bundle and realm reads the same one
export const VALUE = Symbol.for('semantic-ui/value');

// the seven classes register together, so a schema that names one registers them all
export const family = Object.freeze([DateTime, CalendarDate, Time, Duration, DateRange, DateTimeRange, TimeRange]);

const NANOSECONDS_PER_MILLISECOND = 1_000_000n;

// a Date beside a DateTime in one pool keys on the same line
export const instant = (
  value,
) => (isDate(value) ? BigInt(value.getTime()) * NANOSECONDS_PER_MILLISECOND : value.epochNanoseconds);

export const day = (value) => value.year * 10000 + value.month * 100 + value.day;

// nanoseconds since midnight, under 2^53
export const clock = (value) =>
  ((value.hour * 60 + value.minute) * 60 + value.second) * 1e9
  + value.millisecond * 1e6 + value.microsecond * 1e3 + value.nanosecond;

// a month has no length without the calendar it was measured against, and the calendar does not
// travel, so a stored or compared length is written in days and below
export const assertLength = (value) => {
  if (value.years || value.months) {
    refuse('calendarDuration', String(value), {
      explanation: isDevelopment
        ? "months and years have no length on their own, and the day they were measured from does not travel. store until(end, 'days'), or the two dates"
        : 0,
    });
  }
  return value;
};

export const length = (value) => assertLength(value).toMilliseconds();

export const text = (value) => value.toJSON();

// the write door hands back what the factory refuses, for a schema's validate to flag. read and decode throw the refusal
export const lenient = (read) => (input) => {
  try {
    return read(input);
  }
  catch {
    return input;
  }
};
