import { date } from '@semantic-ui/dates';

const sunday = date('2026-09-06');

console.log(sunday.previous('friday').toString());
console.log(sunday.previous('monday').toString());
console.log(sunday.previous('sunday').toString());
