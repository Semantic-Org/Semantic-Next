import { defineType } from '@semantic-ui/schema';

import { TimeRange, timeRange } from '../range.js';
import { family, lenient, text, VALUE } from './protocol.js';

// a span keys by its wire text and has no single order
TimeRange[VALUE] = defineType(TimeRange, {
  name: 'timeRange',
  parse: lenient(timeRange),
  read: timeRange,
  decode: timeRange,
  encode: text,
  matchKey: text,
  family,
});
