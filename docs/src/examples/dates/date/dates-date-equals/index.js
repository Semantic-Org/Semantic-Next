import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.equals('2026-09-06'));
console.log(day.equals(date(2026, 9, 6)));
console.log(day.equals({ year: 2026, month: 9, day: 6 }));
console.log(day.equals('2026-09-07'));
