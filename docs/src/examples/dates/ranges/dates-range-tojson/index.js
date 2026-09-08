import { dateRange } from '@semantic-ui/dates';

const week = dateRange('2026-09-01', '2026-09-07');

console.log(week.toJSON());
console.log(JSON.stringify({ week }));
console.log(dateRange(JSON.parse(JSON.stringify(week))).equals(week));
