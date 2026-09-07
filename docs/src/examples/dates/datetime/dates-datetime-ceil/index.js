import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:37:42', 'UTC');

console.log(moment.ceil('hour').toString());
console.log(moment.ceil(15, 'minutes').toString());
console.log(moment.ceil('day').toString());
