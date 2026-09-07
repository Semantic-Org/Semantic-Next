import { time } from '@semantic-ui/dates';

console.log(time('9am').isSame('09:59', 'hour'));
console.log(time('9am').isSame('10:00', 'hour'));
console.log(time('09:00').isSame('09:00:30', 'minute'));
