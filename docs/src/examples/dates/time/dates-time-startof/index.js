import { time } from '@semantic-ui/dates';

const moment = time('14:37:42.500');

console.log(moment.startOf('hour').toString());
console.log(moment.startOf('minute').toString());
console.log(moment.startOf('second').toString());
