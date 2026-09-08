import { time } from '@semantic-ui/dates';

console.log(time('09:00').until('17:30').toString());
console.log(time('09:00').until('17:30').format());
console.log(time('09:00').until('17:30', 'hours'));

// signed within the day, so an earlier time comes out negative
console.log(time('22:00').until('02:00', 'hours'));
