import { date } from '@semantic-ui/dates';

console.log(date('2028-02-01').isLeapYear());
console.log(date('2026-02-01').isLeapYear());
console.log(date('2028-02-01').daysInYear);
