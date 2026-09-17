import { defineType, registerType } from '@semantic-ui/schema';

import { lenient, text } from '../helpers/types.js';
import { DateRange, dateRange } from '../range.js';

// a span keys by its wire text and has no single order
export const DateRangeType = registerType(
  defineType(DateRange, {
    name: 'dateRange',
    parse: lenient(dateRange),
    read: dateRange,
    decode: dateRange,
    encode: text,
    matchKey: text,
  }),
);
