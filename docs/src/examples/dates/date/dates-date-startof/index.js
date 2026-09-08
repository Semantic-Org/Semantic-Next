import { date } from '@semantic-ui/dates';

const sunday = date('2026-09-06');

console.log(sunday.startOf('week').toString());
console.log(sunday.startOf('week', 'sunday').toString());
console.log(sunday.startOf('month').toString());
console.log(sunday.startOf('quarter').toString());
console.log(sunday.startOf('year').toString());
