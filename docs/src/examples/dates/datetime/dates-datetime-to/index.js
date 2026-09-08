import { datetime, hours } from '@semantic-ui/dates';

const start = datetime('2026-09-06T09:00', 'UTC');

console.log(start.to('2026-09-06T17:00').toString());
console.log(start.to(hours(8)).toString());
console.log(start.to('2h').toString());
console.log(start.to(90, 'minutes').toString());

// the end is excluded
console.log(start.to(hours(8)).contains('2026-09-06T17:00Z'));
