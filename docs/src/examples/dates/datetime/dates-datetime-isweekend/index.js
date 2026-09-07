import { datetime } from '@semantic-ui/dates';

console.log(datetime('2026-09-05T14:30', 'UTC').isWeekend());
console.log(datetime('2026-09-06T14:30', 'UTC').isWeekend());
console.log(datetime('2026-09-07T14:30', 'UTC').isWeekend());

// judged in the zone, where sunday evening in New York is already monday in Tokyo
const evening = datetime('2026-09-06T23:00', 'America/New_York');
console.log(evening.isWeekend());
console.log(evening.in('Asia/Tokyo').isWeekend());
