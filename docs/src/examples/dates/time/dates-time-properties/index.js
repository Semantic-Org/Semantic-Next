import { time } from '@semantic-ui/dates';

const moment = time('17:30:15.250');

// the configured locale's common form, the line a console preview leads with
console.log(moment.text);

console.log(moment.hour, moment.minute, moment.second, moment.millisecond);
console.log(time('9:00:00.000000001').nanosecond);
