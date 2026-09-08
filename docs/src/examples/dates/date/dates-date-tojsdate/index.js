import { date } from '@semantic-ui/dates';

console.log(date('2026-11-03').toJSDate('UTC').toISOString());
console.log(date('2026-11-03').toJSDate('America/Los_Angeles').toISOString());
console.log(date('2026-11-03').toJSDate() instanceof Date);
