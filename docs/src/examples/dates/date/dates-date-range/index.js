import { date } from '@semantic-ui/dates';

const day = date('2026-09-15');

console.log(day.range('month').toString());
console.log(day.range('week').toString());
console.log(day.range('week', 'sunday').toString());
console.log(day.range('quarter').toString());
console.log(day.range('year').duration.total('days'));
