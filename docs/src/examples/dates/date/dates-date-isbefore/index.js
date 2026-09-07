import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.isBefore('2026-09-07'));
console.log(day.isBefore(date('2026-01-01')));
console.log(day.isBefore('2026-09-06'));
