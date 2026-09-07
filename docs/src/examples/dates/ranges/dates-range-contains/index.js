import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

// a date range runs through its end
const week = dateRange('2026-09-01', '2026-09-07');
console.log(week.contains('2026-09-07'));
console.log(week.contains('2026-09-08'));
console.log(week.contains(dateRange('2026-09-02', '2026-09-05')));

// a datetime range runs until its end
const booked = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(1));
console.log(booked.contains('2026-09-06T09:30Z'));
console.log(booked.contains('2026-09-06T10:00Z'));

// a time range across midnight holds the small hours
const night = timeRange('22:00', '06:00');
console.log(night.contains('01:00'));
console.log(night.contains('12:00'));
console.log(night.contains(timeRange('23:00', '02:00')));
