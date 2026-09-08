import { date, dateRange, datetime, datetimeRange, hours, minutes, timeRange } from '@semantic-ui/dates';

console.log(date('2026-01-01').range('year').split('quarter').map(String));
console.log(dateRange('2026-09-01', '2026-09-30').split('week').length);

const shift = datetimeRange(datetime('2026-09-06T09:00', 'UTC'), hours(8));
console.log(shift.split(hours(3)).map((slot) => slot.duration.total('hours')));

console.log(timeRange('09:00', '17:00').split(minutes(30)).length);
console.log(timeRange('22:00', '06:00').split(hours(4)).map(String));
