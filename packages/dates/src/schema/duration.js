import { defineType, registerType } from '@semantic-ui/schema';
import { isDevelopment } from '@semantic-ui/utils';

import { Duration, duration } from '../duration.js';
import { refuse } from '../helpers/errors.js';
import { lenient } from '../helpers/types.js';

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

// a length adds, so a sum over a column of them totals milliseconds, and the wire form refuses a
// month or a year the way the key does
export const DurationType = registerType(defineType(Duration, {
  name: 'duration',
  parse: lenient(duration),
  read: duration,
  decode: duration,
  encode: (value) => assertLength(value).toJSON(),
  matchKey: (value) => assertLength(value).toMilliseconds(),
  ordered: true,
  summable: true,
}));
