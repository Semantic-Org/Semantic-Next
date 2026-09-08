import { time } from '@semantic-ui/dates';

console.log(time('5pm').isAfter('9am'));
console.log(time('9am').isAfter('5pm'));
console.log(time('09:00:01').isAfter(time('09:00')));
