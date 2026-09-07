import { date, dateRange, datetime, datetimeRange, hours, kindOf, time, timeRange } from '@semantic-ui/dates';

console.log(kindOf(datetime('2026-09-06T14:30Z')));
console.log(kindOf(date('2026-09-06')));
console.log(kindOf(time('9am')));
console.log(kindOf(hours(1)));
console.log(kindOf(dateRange('2026-09-01', '2026-09-07')));
console.log(kindOf(datetimeRange(datetime('2026-09-06T09:00Z'), hours(1))));
console.log(kindOf(timeRange('09:00', '17:00')));

console.log(kindOf('2026-09-06'));
console.log(kindOf(new Date()));
