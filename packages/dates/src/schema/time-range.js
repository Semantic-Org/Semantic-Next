import { defineType } from '@semantic-ui/schema';

import { lenient, text } from '../helpers/types.js';
import { TimeRange, timeRange } from '../range.js';

// a span keys by its wire text and has no single order
export const TimeRangeType = defineType(TimeRange, {
  name: 'timeRange',
  parse: lenient(timeRange),
  read: timeRange,
  decode: timeRange,
  encode: text,
  matchKey: text,
});
