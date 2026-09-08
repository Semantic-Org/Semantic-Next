import { datetime, months } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'UTC');

console.log(moment.minus(months(1)).toString());
console.log(moment.minus({ days: 7 }).toString());
console.log(moment.minus('45m').toString());
console.log(moment.minus(1, 'year').toString());
