import { defineType, registerType } from '@semantic-ui/schema';
import { isDate, isDevelopment } from '@semantic-ui/utils';

import { CalendarDate } from '../calendar-date.js';
import { DateTime, datetime } from '../date-time.js';
import { refuse } from '../helpers/errors.js';
import { lenient, text } from '../helpers/types.js';
import { configure } from '../helpers/zones.js';

// a calendar day against an instant field means that whole day in the app's zone, half-open, and
// each operator reads it in those terms: the day for eq, its complement for $ne, its first instant
// for $gte and $lt, the next day's for $lte and $gt. the answer is an $or of operator maps on the
// field, one map where one suffices, and anything else answers undefined so a data layer reads the
// operand through the factory instead. the zone is configured once in shared code, so the client
// and the server read one day
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

const DAY = {
  eq: ([start, end]) => [{ $gte: start, $lt: end }],
  $ne: ([start, end]) => [{ $lt: start }, { $gte: end }],
  $gte: ([start]) => [{ $gte: start }],
  $lt: ([start]) => [{ $lt: start }],
  $lte: ([, end]) => [{ $lt: end }],
  $gt: ([, end]) => [{ $gte: end }],
};

const condition = (operator, operand) => (
  DAY[operator] && operand instanceof CalendarDate ? DAY[operator](dayBounds(operand)) : undefined
);

// the instant kind alone states what a calendar day means for it, and upgrades the built-in Date it stands in for
export const DateTimeType = registerType(defineType(DateTime, {
  name: 'datetime',
  parse: lenient(datetime),
  read: datetime,
  decode: datetime,
  encode: text,
  // epoch nanoseconds, so a Date beside a DateTime in one pool keys on the same line
  matchKey: (value) => (isDate(value) ? BigInt(value.getTime()) * 1_000_000n : value.epochNanoseconds),
  ordered: true,
  condition,
  upgrades: Date,
}));
