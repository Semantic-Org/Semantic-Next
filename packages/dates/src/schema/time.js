import { defineType } from '@semantic-ui/schema';

import { Time, time } from '../time.js';
import { clock, family, lenient, text, VALUE } from './protocol.js';

Time[VALUE] = defineType(Time, {
  name: 'time',
  parse: lenient(time),
  read: time,
  decode: time,
  encode: text,
  matchKey: clock,
  ordered: true,
  family,
});
