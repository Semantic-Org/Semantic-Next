import { isDate, isDevelopment } from '@semantic-ui/utils';

import { CalendarDate, date } from './calendar-date.js';
import { DateTime, datetime } from './date-time.js';
import { Duration, duration } from './duration.js';
import { refuse } from './helpers/errors.js';
import { configure } from './helpers/zones.js';
import { DateRange, dateRange, DateTimeRange, datetimeRange, TimeRange, timeRange } from './range.js';
import { Time, time } from './time.js';

/*
  the value protocol, what a schema reads off a class to store, compare and order its values:
  the kind's name, a strict read for the wire and a read for a write, a primitive key injective
  over equals(), whether the kind orders, and the family that registers together. a length declares
  summable and a wire form stricter than toJSON(), and the instant kind declares span, the read of
  a calendar day as a whole day. the reads throw this library's own refusal. attached here, in a subpath of its own, so the bare entry has none
  of it and a schema that names one class is the whole opt-in
*/

export const VALUE = Symbol.for('semantic-ui/value');

const NANOSECONDS_PER_MILLISECOND = 1_000_000n;

// a Date beside a DateTime in one pool keys on the same line
const instant = (
  value,
) => (isDate(value) ? BigInt(value.getTime()) * NANOSECONDS_PER_MILLISECOND : value.epochNanoseconds);

const day = (value) => value.year * 10000 + value.month * 100 + value.day;

// nanoseconds since midnight, under 2^53
const clock = (value) =>
  ((value.hour * 60 + value.minute) * 60 + value.second) * 1e9
  + value.millisecond * 1e6 + value.microsecond * 1e3 + value.nanosecond;

// a month has no length without the calendar it was measured against, and the calendar does not
// travel, so a stored or compared length is written in days and below
const assertLength = (value) => {
  if (value.years || value.months) {
    refuse('calendarDuration', String(value), {
      explanation: isDevelopment
        ? "months and years have no length on their own, and the day they were measured from does not travel. store until(end, 'days'), or the two dates"
        : 0,
    });
  }
  return value;
};

const length = (value) => assertLength(value).toMilliseconds();

const text = (value) => value.toJSON();

// a calendar day against an instant field is that whole day in the app's zone, half-open. the
// zone is configured once in shared code, so the client and the server read the same day
const dayBounds = (day) => {
  const { zone } = configure();
  if (zone === undefined) {
    refuse('noZone', String(day), {
      explanation: isDevelopment
        ? "a day against an instant field means that day in the app's zone, and none is configured. configure({ zone: 'America/New_York' }) once in shared code, so every side reads one day"
        : 0,
    });
  }
  return [day.at('00:00', zone), day.plus({ days: 1 }).at('00:00', zone)];
};

const family = Object.freeze([DateTime, CalendarDate, Time, Duration, DateRange, DateTimeRange, TimeRange]);

const declare = (Kind, kind, read, key, ordered, extra) => {
  Kind[VALUE] = Object.freeze({ kind, parse: read, decode: read, key, ordered, family, ...extra });
};

declare(DateTime, 'datetime', datetime, instant, true, {
  span: (operand) => (operand instanceof CalendarDate ? dayBounds(operand) : undefined),
});
declare(CalendarDate, 'date', date, day, true);
declare(Time, 'time', time, clock, true);
// a length adds, so a sum over a column of them totals milliseconds
declare(Duration, 'duration', duration, length, true, {
  encode: (value) => assertLength(value).toJSON(),
  summable: true,
});
declare(DateRange, 'dateRange', dateRange, text, false);
declare(DateTimeRange, 'datetimeRange', datetimeRange, text, false);
declare(TimeRange, 'timeRange', timeRange, text, false);

export { CalendarDate, DateRange, DateTime, DateTimeRange, Duration, Time, TimeRange };
