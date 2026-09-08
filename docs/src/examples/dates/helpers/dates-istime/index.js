import { datetime, isTime, time } from '@semantic-ui/dates';

console.log(isTime(time('9am')));
console.log(isTime(datetime('2026-09-06T14:30Z').time));
console.log(isTime(datetime('2026-09-06T14:30Z')));
console.log(isTime(new Date()));
console.log(isTime('09:00'));
