import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30Z', 'UTC');

console.log(moment.isBefore('2026-09-07T00:00Z'));
console.log(moment.isBefore(datetime('2026-01-01T00:00Z')));
console.log(moment.isBefore(new Date('2026-09-06T15:00:00Z')));

// a date reads as its midnight in this moment's zone
console.log(moment.isBefore('2026-09-07'));
