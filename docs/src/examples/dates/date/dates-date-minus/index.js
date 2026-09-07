import { date, days } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.minus(days(7)).toString());
console.log(day.minus({ months: 1 }).toString());
console.log(day.minus('2 weeks').toString());
console.log(day.minus(1, 'year').toString());
console.log(date('2026-03-01').minus(days(1)).toString());
