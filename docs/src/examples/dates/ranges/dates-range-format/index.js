import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

const week = dateRange('2026-09-01', '2026-09-07');

console.log(week.format());
console.log(week.format('long'));
console.log(week.format({ month: 'short', day: 'numeric' }));
console.log(week.format('medium', 'de-DE'));

const meeting = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(1));
console.log(meeting.format());
console.log(meeting.format('time'));

console.log(timeRange('22:00', '06:00').format());
