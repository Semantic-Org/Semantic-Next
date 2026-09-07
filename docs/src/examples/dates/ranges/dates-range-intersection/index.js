import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

const september = dateRange('2026-09-01', '2026-09-30');
console.log(september.intersection(dateRange('2026-09-20', '2026-10-20')).toString());
console.log(september.intersection(dateRange('2026-10-01', '2026-10-05')));

const booked = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(1));
console.log(booked.intersection(datetimeRange(datetime('2026-09-06T09:30', 'UTC'), hours(1))).toString());

const night = timeRange('22:00', '06:00');
console.log(night.intersection(timeRange('05:00', '09:00')).toString());

// one range cannot hold an overlap that comes out in two pieces
try {
  night.intersection(timeRange('05:00', '23:00'));
}
catch (error) {
  console.log(error.code);
}
