import { date, time } from '@semantic-ui/dates';

const opening = time('9am').on('2026-09-06', 'America/New_York');

console.log(opening.toString());
console.log(opening.format('long'));

console.log(time('5:30pm').on(date('2026-09-06'), 'UTC').toString());
