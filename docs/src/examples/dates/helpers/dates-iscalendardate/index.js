import { date, datetime, isCalendarDate, today } from '@semantic-ui/dates';

console.log(isCalendarDate(date('2026-09-06')));
console.log(isCalendarDate(today()));
console.log(isCalendarDate(datetime('2026-09-06T14:30Z')));
console.log(isCalendarDate(new Date()));
console.log(isCalendarDate('2026-09-06'));
