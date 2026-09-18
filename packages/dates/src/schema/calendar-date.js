import { defineType } from '@semantic-ui/schema';

import { CalendarDate, date } from '../calendar-date.js';
import { lenient, text } from '../helpers/types.js';

export const CalendarDateType = defineType(CalendarDate, {
  name: 'date',
  parse: lenient(date),
  read: date,
  decode: date,
  encode: text,
  matchKey: (value) => value.year * 10000 + value.month * 100 + value.day,
  ordered: true,
});
