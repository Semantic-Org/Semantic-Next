import { datetime, time } from '@semantic-ui/dates';

console.log(time('09:00').toString());
console.log(time('9am').toString());
console.log(time('5:30 pm').toString());
console.log(time('17:30:15.250').toString());
console.log(time(9, 30).toString());
console.log(time({ hours: 17 }).toString());

// the clock of a datetime, or of a Date read in a zone
console.log(time(datetime('2026-09-06T14:30Z', 'UTC')).toString());
console.log(time(new Date('2026-09-06T14:30:00Z'), 'Asia/Tokyo').toString());

// a loose read takes what Date reads, and gives null for the rest
console.log(time('September 6, 2026 5:30 PM', { loose: true }).toString());
console.log(time('noonish', { loose: true }));
