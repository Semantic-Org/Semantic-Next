import { time } from '@semantic-ui/dates';

const moment = time('17:30:15.250');

console.log(moment.hour, moment.minute, moment.second, moment.millisecond);
console.log(time('9:00:00.000000001').nanosecond);
