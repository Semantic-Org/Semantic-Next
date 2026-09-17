import { defineType } from '@semantic-ui/schema';

import { DateRange, dateRange } from '../range.js';
import { family, lenient, text, VALUE } from './protocol.js';

// a span keys by its wire text and has no single order
DateRange[VALUE] = defineType(DateRange, {
  name: 'dateRange',
  parse: lenient(dateRange),
  read: dateRange,
  decode: dateRange,
  encode: text,
  matchKey: text,
  family,
});
