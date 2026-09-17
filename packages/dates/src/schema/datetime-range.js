import { defineType } from '@semantic-ui/schema';

import { DateTimeRange, datetimeRange } from '../range.js';
import { family, lenient, text, VALUE } from './protocol.js';

// a span keys by its wire text and has no single order
DateTimeRange[VALUE] = defineType(DateTimeRange, {
  name: 'datetimeRange',
  parse: lenient(datetimeRange),
  read: datetimeRange,
  decode: datetimeRange,
  encode: text,
  matchKey: text,
  family,
});
