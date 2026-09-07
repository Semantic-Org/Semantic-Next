import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

const week = dateRange('2026-09-01', '2026-09-07');
console.log(week.start.toString(), week.end.toString());
console.log(week.kind);
console.log(week.duration.total('days'));

const shift = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(8));
console.log(shift.kind);
console.log(shift.end.toString());
console.log(shift.duration.format());

const night = timeRange('22:00', '06:00');
console.log(night.kind);
console.log(night.duration.total('hours'));
