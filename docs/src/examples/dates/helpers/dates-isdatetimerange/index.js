import { dateRange, datetime, datetimeRange, hours, isDateTimeRange } from '@semantic-ui/dates';

console.log(isDateTimeRange(datetimeRange(datetime('2026-09-06T09:00Z'), hours(1))));
console.log(isDateTimeRange(dateRange('2026-09-01', '2026-09-07').in('UTC')));
console.log(isDateTimeRange(dateRange('2026-09-01', '2026-09-07')));
console.log(isDateTimeRange(new Date()));
console.log(isDateTimeRange('2026-09-06T09:00Z/2026-09-06T10:00Z'));
