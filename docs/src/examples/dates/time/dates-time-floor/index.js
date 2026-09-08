import { time } from '@semantic-ui/dates';

const moment = time('14:37:42');

console.log(moment.floor('hour').toString());
console.log(moment.floor(15, 'minutes').toString());
