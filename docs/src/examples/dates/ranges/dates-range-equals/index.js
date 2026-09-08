import { dateRange, days, timeRange } from '@semantic-ui/dates';

const week = dateRange('2026-09-01', '2026-09-07');

console.log(week.equals('2026-09-01/2026-09-07'));
console.log(week.equals(dateRange('2026-09-01', days(7))));
console.log(week.equals(dateRange('2026-09-01', '2026-09-08')));
console.log(timeRange('22:00', '06:00').equals(timeRange('22:00', '06:00')));
