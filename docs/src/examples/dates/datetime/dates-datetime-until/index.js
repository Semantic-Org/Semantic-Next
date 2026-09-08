import { datetime } from '@semantic-ui/dates';

const start = datetime('2026-01-01T00:00Z', 'UTC');
const end = datetime('2026-04-05T06:07Z', 'UTC');

console.log(start.until(end).toString());
console.log(start.until(end).format());
console.log(start.until(end, 'hours'));
console.log(start.until(end, 'days'));

// signed
console.log(end.until(start).toString());

// the duration remembers where it started, so months total
console.log(start.until('2026-07-01T00:00Z').total('months'));
