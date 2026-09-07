import { time } from '@semantic-ui/dates';

const moment = time('14:37:42');

console.log(moment.ceil('hour').toString());
console.log(moment.ceil(15, 'minutes').toString());
