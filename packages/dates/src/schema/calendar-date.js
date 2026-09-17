import { defineType } from '@semantic-ui/schema';

import { CalendarDate, date } from '../calendar-date.js';
import { day, family, lenient, text, VALUE } from './protocol.js';

CalendarDate[VALUE] = defineType(CalendarDate, {
  name: 'date',
  parse: lenient(date),
  read: date,
  decode: date,
  encode: text,
  matchKey: day,
  ordered: true,
  family,
});
