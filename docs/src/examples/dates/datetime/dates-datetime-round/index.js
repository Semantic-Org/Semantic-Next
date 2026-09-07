import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:37:42', 'UTC');

console.log(moment.round('hour').toString());
console.log(moment.round('minute').toString());
console.log(moment.round(15, 'minutes').toString());
console.log(moment.round(30, 'minutes').toString());
