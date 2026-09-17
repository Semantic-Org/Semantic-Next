import { DateRange, dateRange } from '../range.js';
import { family, text, VALUE } from './protocol.js';

DateRange[VALUE] = Object.freeze({
  kind: 'dateRange',
  parse: dateRange,
  decode: dateRange,
  key: text,
  ordered: false,
  family,
});
