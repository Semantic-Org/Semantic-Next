import { time } from '@semantic-ui/dates';

console.log(time('17:00').since('9am').toString());
console.log(time('17:00').since('9am', 'minutes'));
console.log(time('09:00').since('17:00', 'hours'));
