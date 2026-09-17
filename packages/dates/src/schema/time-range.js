import { TimeRange, timeRange } from '../range.js';
import { family, text, VALUE } from './protocol.js';

TimeRange[VALUE] = Object.freeze({
  kind: 'timeRange',
  parse: timeRange,
  decode: timeRange,
  key: text,
  ordered: false,
  family,
});
