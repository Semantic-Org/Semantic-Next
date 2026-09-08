import { date, days } from '@semantic-ui/dates';

const start = date('2026-09-01');

console.log(start.to('2026-09-07').toString());
console.log(start.to(days(7)).toString());
console.log(start.to('1 week').toString());
console.log(start.to(42, 'days').toString());

// the last day is included
console.log(start.to(days(7)).contains('2026-09-07'));
console.log(start.to(days(7)).duration.total('days'));
