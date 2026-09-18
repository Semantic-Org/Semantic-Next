import { defineType } from '@semantic-ui/schema';

import { lenient, text } from '../helpers/types.js';
import { Time, time } from '../time.js';

export const TimeType = defineType(Time, {
  name: 'time',
  parse: lenient(time),
  read: time,
  decode: time,
  encode: text,
  // nanoseconds since midnight, under 2^53
  matchKey: (value) =>
    ((value.hour * 60 + value.minute) * 60 + value.second) * 1e9 + value.millisecond * 1e6 + value.microsecond * 1e3
    + value.nanosecond,
  ordered: true,
});
