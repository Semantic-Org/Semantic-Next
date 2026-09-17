import { CalendarDate, date } from '../calendar-date.js';
import { day, family, VALUE } from './protocol.js';

CalendarDate[VALUE] = Object.freeze({ kind: 'date', parse: date, decode: date, key: day, ordered: true, family });
