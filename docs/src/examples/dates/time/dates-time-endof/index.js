import { time } from '@semantic-ui/dates';

const moment = time('14:37:42');

console.log(moment.endOf('hour').toString());
console.log(moment.endOf('minute').toString());
