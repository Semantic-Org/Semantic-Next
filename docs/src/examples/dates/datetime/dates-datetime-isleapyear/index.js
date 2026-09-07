import { datetime } from '@semantic-ui/dates';

console.log(datetime('2028-02-01T00:00', 'UTC').isLeapYear());
console.log(datetime('2026-02-01T00:00', 'UTC').isLeapYear());
console.log(datetime('2028-02-01T00:00', 'UTC').daysInYear);
