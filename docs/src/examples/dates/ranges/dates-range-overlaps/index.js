import { dateRange, datetime, datetimeRange, hours, timeRange } from '@semantic-ui/dates';

const september = dateRange('2026-09-01', '2026-09-30');
console.log(september.overlaps(dateRange('2026-09-30', '2026-10-05')));
console.log(september.overlaps(dateRange('2026-10-01', '2026-10-05')));

// back to back bookings do not overlap
const booked = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(1));
console.log(booked.overlaps(datetimeRange(datetime('2026-09-06T10:00', 'UTC'), hours(1))));
console.log(booked.overlaps(datetimeRange(datetime('2026-09-06T09:30', 'UTC'), hours(1))));

const night = timeRange('22:00', '06:00');
console.log(night.overlaps(timeRange('05:00', '09:00')));
console.log(night.overlaps(timeRange('07:00', '21:00')));
