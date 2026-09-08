import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.isSame('2026-09-30', 'month'));
console.log(day.isSame('2026-10-01', 'month'));
console.log(day.isSame('2026-12-31', 'year'));
console.log(day.isSame('2026-11-15', 'quarter'));

// a week on the configured first day, or one named
console.log(day.isSame('2026-09-01', 'week'));
console.log(day.isSame('2026-09-01', 'week', 'sunday'));
