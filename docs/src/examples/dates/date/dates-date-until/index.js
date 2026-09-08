import { date } from '@semantic-ui/dates';

const start = date('2026-01-01');

console.log(start.until('2027-04-05').toString());
console.log(start.until('2027-04-05').format());
console.log(start.until('2027-04-05', 'days'));
console.log(start.until('2027-04-05', 'weeks'));

// the duration remembers where it started, so months total exactly
console.log(start.until('2026-07-01').total('months'));

// signed
console.log(date('2027-04-05').until(start).isNegative());
