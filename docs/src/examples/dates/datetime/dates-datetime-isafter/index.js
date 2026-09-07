import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30Z', 'UTC');

console.log(moment.isAfter('2026-09-06T00:00Z'));
console.log(moment.isAfter(datetime('2027-01-01T00:00Z')));
console.log(moment.isAfter(new Date('2026-09-06T14:00:00Z')));
console.log(moment.isAfter('2026-09-06'));
