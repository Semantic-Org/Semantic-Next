import { datetime, datetimeRange, hours } from '@semantic-ui/dates';

const start = datetime('2026-09-06T09:00', 'UTC');

console.log(datetimeRange(start, hours(8)).toString());
console.log(datetimeRange(start, '2026-09-06T17:00').toString());
console.log(datetimeRange(start, '2h').toString());
console.log(datetimeRange('2026-09-06T09:00Z/2026-09-06T17:00Z').toString());

// a zone reads a wall-clock start, and the end follows the start's zone
const shift = datetimeRange('2026-09-07T09:00', '2h', { zone: 'Europe/Berlin' });
console.log(shift.start.zone);
console.log(shift.toString());
