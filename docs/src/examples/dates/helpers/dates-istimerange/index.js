import { dateRange, isTimeRange, time, timeRange } from '@semantic-ui/dates';

console.log(isTimeRange(timeRange('09:00', '17:00')));
console.log(isTimeRange(time('9am').to('5pm')));
console.log(isTimeRange(dateRange('2026-09-01', '2026-09-07')));
console.log(isTimeRange(new Date()));
console.log(isTimeRange('09:00/17:00'));
