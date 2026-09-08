import { datetime } from '@semantic-ui/dates';

const start = datetime('2026-01-01T00:00Z', 'UTC');
const end = datetime('2026-04-05T06:07Z', 'UTC');

console.log(end.since(start).toString());
console.log(end.since(start).format('short'));
console.log(end.since(start, 'days'));
console.log(end.since('2026-04-05T00:00Z').format());
