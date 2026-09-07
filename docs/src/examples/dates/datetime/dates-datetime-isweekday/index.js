import { datetime } from '@semantic-ui/dates';

console.log(datetime('2026-09-07T09:00', 'UTC').isWeekday());
console.log(datetime('2026-09-11T09:00', 'UTC').isWeekday());
console.log(datetime('2026-09-12T09:00', 'UTC').isWeekday());
