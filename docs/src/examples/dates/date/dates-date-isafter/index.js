import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.isAfter('2026-09-05'));
console.log(day.isAfter(date('2027-01-01')));
console.log(day.isAfter('2026-09-06'));
