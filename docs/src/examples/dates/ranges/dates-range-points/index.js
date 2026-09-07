import { date, dateRange, datetime, datetimeRange, hours, months, timeRange } from '@semantic-ui/dates';

console.log(dateRange('2026-09-01', '2026-09-07').points('day').map(String));

// steps count from the start, so monthly from the 31st lands on each month's last day
console.log(dateRange(date('2026-01-31'), months(6)).points('month').map(String));

const shift = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(8));
console.log(shift.points(hours(2)).map((point) => point.format('HH:mm')));
console.log(shift.points(30, 'minutes').length);

// a time range across midnight walks through it
console.log(timeRange('22:00', '06:00').points('hour').map(String));
