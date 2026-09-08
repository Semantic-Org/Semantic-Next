import { minutes, time } from '@semantic-ui/dates';

console.log(time('17:30').minus(minutes(45)).toString());
console.log(time('17:30').minus({ hours: 8 }).toString());
console.log(time('17:30').minus('30m').toString());
console.log(time('17:30').minus(2, 'hours').toString());

// the clock wraps
console.log(time('00:30').minus(minutes(45)).toString());
