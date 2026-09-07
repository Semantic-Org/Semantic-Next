import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.toJSON());
console.log(JSON.stringify({ on: day }));
console.log(date(JSON.parse(JSON.stringify(day))).equals(day));
