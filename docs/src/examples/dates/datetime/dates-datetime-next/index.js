import { datetime } from '@semantic-ui/dates';

const sunday = datetime('2026-09-06T14:30', 'UTC');

console.log(sunday.next('friday').toString());
console.log(sunday.next('Fri').toString());
console.log(sunday.next(5).toString());

// strictly after, so the same weekday is a week away
console.log(sunday.next('sunday').toString());
