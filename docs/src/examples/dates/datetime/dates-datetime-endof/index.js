import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:37:42', 'UTC');

console.log(moment.endOf('hour').toString());
console.log(moment.endOf('day').toString());
console.log(moment.endOf('week').toString());
console.log(moment.endOf('month').toString());
console.log(moment.endOf('year').toString());
