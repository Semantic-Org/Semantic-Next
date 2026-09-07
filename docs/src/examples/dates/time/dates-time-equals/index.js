import { time } from '@semantic-ui/dates';

const moment = time('9am');

console.log(moment.equals('09:00'));
console.log(moment.equals(time(9, 0)));
console.log(moment.equals({ hours: 9 }));
console.log(moment.equals('9:01'));
