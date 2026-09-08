import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'UTC');

console.log(moment.range('day').toString());
console.log(moment.range('month').toString());
console.log(moment.range('week').toString());
console.log(moment.range('week', 'sunday').toString());

// the next start is excluded
console.log(moment.range('day').contains('2026-09-07T00:00Z'));
