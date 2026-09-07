import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

const week = dateRange('2026-09-01', '2026-09-07');

console.log(week.toString());
console.log(datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(1)).toString());
console.log(timeRange('9am', '5pm').toString());
console.log(dateRange(week.toString()).equals(week));
