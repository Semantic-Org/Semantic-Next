import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:37:42', 'UTC');

console.log(moment.startOf('hour').toString());
console.log(moment.startOf('day').toString());
console.log(moment.startOf('month').toString());
console.log(moment.startOf('quarter').toString());
console.log(moment.startOf('year').toString());

// a week starts on monday unless configured, or asked, otherwise
console.log(moment.startOf('week').toString());
console.log(moment.startOf('week', 'sunday').toString());
