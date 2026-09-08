import { date, datetime, earliest, time } from '@semantic-ui/dates';

console.log(earliest('2026-09-06', '2026-01-01', '2027-01-01').toString());
console.log(earliest([date('2026-09-06'), date('2026-01-01')]).toString());
console.log(earliest(time('9am'), time('5pm')).toString());
console.log(earliest(datetime('2026-09-06T14:30Z'), datetime('2026-09-07T14:30Z')).toString());

// a raw value beside a point reads as the point's kind
console.log(earliest(datetime('2026-09-06T12:00Z', 'UTC'), '2026-09-07').toString());
