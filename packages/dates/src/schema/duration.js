import { Duration, duration } from '../duration.js';
import { assertLength, family, length, VALUE } from './protocol.js';

// a length adds, so a sum over a column of them totals milliseconds, and the wire form refuses a
// month or a year the way the key does
Duration[VALUE] = Object.freeze({
  kind: 'duration',
  parse: duration,
  decode: duration,
  key: length,
  ordered: true,
  family,
  encode: (value) => assertLength(value).toJSON(),
  summable: true,
});
