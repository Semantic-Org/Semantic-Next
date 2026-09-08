import { date, minutes } from '@semantic-ui/dates';

const day = date('2026-09-07');

console.log(day.split('hour').length);
console.log(day.split(minutes(30)).length);
console.log(day.split(8, 'hours', 'UTC').map(String));

// a daylight saving change makes a 23 hour day
console.log(date('2026-03-08').split('hour', 'America/New_York').length);
