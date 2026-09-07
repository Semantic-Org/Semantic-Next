import { date, datetime } from '@semantic-ui/dates';

console.log(date('2026-09-06').toString());
console.log(date(2026, 9, 6).toString());
console.log(date({ year: 2026, month: 2, day: 28 }).toString());

// a wall-clock string keeps its day
console.log(date('2026-09-06T23:30').toString());

// a datetime gives its date in its zone
console.log(date(datetime('2026-09-06T23:30Z').in('Asia/Tokyo')).toString());

// a Date is an instant, so its day depends on the zone it is read in
console.log(date(new Date('2026-09-06T23:30:00Z'), 'Asia/Tokyo').toString());
console.log(date(new Date('2026-09-06T23:30:00Z'), 'UTC').toString());

// a loose read takes what Date reads, and gives null for the rest
console.log(date('September 6, 2026', { loose: true }).toString());
console.log(date('someday', { loose: true }));
