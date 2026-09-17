import { DateTimeRange, datetimeRange } from '../range.js';
import { family, text, VALUE } from './protocol.js';

DateTimeRange[VALUE] = Object.freeze({
  kind: 'datetimeRange',
  parse: datetimeRange,
  decode: datetimeRange,
  key: text,
  ordered: false,
  family,
});
