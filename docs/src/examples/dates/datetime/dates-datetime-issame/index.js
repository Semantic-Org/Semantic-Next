import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30Z', 'UTC');

console.log(moment.isSame('2026-09-06T23:00Z', 'day'));
console.log(moment.isSame('2026-09-30T00:00Z', 'month'));
console.log(moment.isSame('2026-09-06T14:59Z', 'hour'));

// judged in this moment's zone, where 23:00Z is already tomorrow in Tokyo
console.log(moment.in('Asia/Tokyo').isSame('2026-09-06T23:00Z', 'day'));

// a week on the configured first day, or one named
console.log(moment.isSame('2026-09-01T00:00Z', 'week'));
console.log(moment.isSame('2026-09-01T00:00Z', 'week', 'sunday'));
