import { time } from '@semantic-ui/dates';

console.log(time('9am').isBefore('5pm'));
console.log(time('5pm').isBefore('9am'));
console.log(time('09:00').isBefore(time('09:00:01')));
