import { date } from '@semantic-ui/dates';

const sunday = date('2026-09-06');

console.log(sunday.endOf('week').toString());
console.log(sunday.endOf('week', 'sunday').toString());
console.log(sunday.endOf('month').toString());
console.log(date('2026-02-10').endOf('month').toString());
console.log(sunday.endOf('year').toString());
