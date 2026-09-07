import { date, dateRange, datetime, days } from '@semantic-ui/dates';

console.log(dateRange('2026-09-01', '2026-09-07').toString());
console.log(dateRange(date('2026-09-06'), days(7)).toString());
console.log(dateRange('2026-09-01', '1 week').toString());
console.log(dateRange('2026-09-01/2026-09-07').toString());

// a text field's own separators read
console.log(dateRange('2026-09-01 - 2026-09-07').toString());
console.log(dateRange('Sep 1 2026 to Sep 7 2026', { loose: true }).toString());

// datetimes read as their dates
console.log(dateRange(datetime('2026-09-06T23:30Z', 'UTC'), datetime('2026-09-08T01:00Z', 'UTC')).toString());

// a loose read gives null rather than a throw for an end that cannot be read
console.log(dateRange('garbage', '2026-09-07', { loose: true }));
