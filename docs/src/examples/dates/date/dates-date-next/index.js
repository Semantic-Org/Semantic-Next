import { date } from '@semantic-ui/dates';

const sunday = date('2026-09-06');

console.log(sunday.next('monday').toString());
console.log(sunday.next('Fri').toString());
console.log(sunday.next(5).toString());

// strictly after, so the same weekday is a week away
console.log(sunday.next('sunday').toString());
