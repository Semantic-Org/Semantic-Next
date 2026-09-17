import { defineType } from '@semantic-ui/schema';

import { Duration, duration } from '../duration.js';
import { assertLength, family, length, lenient, VALUE } from './protocol.js';

// a length adds, so a sum over a column of them totals milliseconds, and the wire form refuses a
// month or a year the way the key does
Duration[VALUE] = defineType(Duration, {
  name: 'duration',
  parse: lenient(duration),
  read: duration,
  decode: duration,
  encode: (value) => assertLength(value).toJSON(),
  matchKey: length,
  ordered: true,
  summable: true,
  family,
});
