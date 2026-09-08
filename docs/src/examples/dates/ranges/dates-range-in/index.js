import { dateRange, datetime, datetimeRange, hours } from '@semantic-ui/dates';

const bounds = dateRange('2026-09-01', '2026-09-07').in('UTC');

console.log(bounds.toString());
console.log(bounds.kind);
console.log(bounds.duration.total('hours'));
console.log(dateRange('2026-09-01', '2026-09-07').in('America/New_York').toString());

const shift = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(1));
console.log(shift.in('Asia/Tokyo').start.format('long'));
console.log(shift.in('Asia/Tokyo').equals(shift));
