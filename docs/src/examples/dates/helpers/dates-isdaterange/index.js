import { date, dateRange, isDateRange, timeRange } from '@semantic-ui/dates';

console.log(isDateRange(dateRange('2026-09-01', '2026-09-07')));
console.log(isDateRange(date('2026-09-15').range('month')));
console.log(isDateRange(timeRange('09:00', '17:00')));
console.log(isDateRange(date('2026-09-01')));
console.log(isDateRange(new Date()));
console.log(isDateRange('2026-09-01/2026-09-07'));
