import { datetime } from '@semantic-ui/dates';

const sunday = datetime('2026-09-06T14:30', 'UTC');

console.log(sunday.previous('friday').toString());
console.log(sunday.previous('monday').toString());
console.log(sunday.previous('sunday').toString());
