import { date, datetime, isDateTime, now } from '@semantic-ui/dates';

console.log(isDateTime(datetime('2026-09-06T14:30Z')));
console.log(isDateTime(now()));
console.log(isDateTime(date('2026-09-06')));
console.log(isDateTime(new Date()));
console.log(isDateTime('2026-09-06T14:30Z'));
