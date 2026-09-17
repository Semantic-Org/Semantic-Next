import { defineType } from '@semantic-ui/schema';

import { lenient, text } from '../helpers/types.js';
import { DateTimeRange, datetimeRange } from '../range.js';

// a span keys by its wire text and has no single order
export const DateTimeRangeType = defineType(DateTimeRange, {
  name: 'datetimeRange',
  parse: lenient(datetimeRange),
  read: datetimeRange,
  decode: datetimeRange,
  encode: text,
  matchKey: text,
});
