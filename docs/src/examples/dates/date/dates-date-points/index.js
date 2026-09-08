import { date, minutes } from '@semantic-ui/dates';

const day = date('2026-09-07');

console.log(day.points('hour').length);
console.log(day.points(minutes(30)).length);
console.log(day.points(6, 'hours', 'UTC').map(String));

// in a zone, so the day starts at its own midnight
console.log(day.points('hour', 'Europe/Berlin')[0].toString());
console.log(day.points(6, 'hours', 'Europe/Berlin').map((point) => point.format('HH:mm z')));
