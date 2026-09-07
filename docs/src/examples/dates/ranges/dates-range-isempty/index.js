import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

console.log(datetimeRange(datetime('2026-09-06T09:00Z', 'UTC'), '2026-09-06T09:00Z').isEmpty());
console.log(datetimeRange(datetime('2026-09-06T09:00Z', 'UTC'), hours(1)).isEmpty());
console.log(timeRange('09:00', '09:00').isEmpty());

console.log(dateRange('2026-09-06', '2026-09-06').isEmpty());
console.log(dateRange('2026-09-06', '2026-09-06').duration.total('days'));
