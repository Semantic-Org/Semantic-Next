import { time } from '@semantic-ui/dates';

const moment = time('14:37:42');

console.log(moment.round('hour').toString());
console.log(moment.round('minute').toString());
console.log(moment.round(15, 'minutes').toString());
console.log(moment.round(30, 'minutes').toString());
