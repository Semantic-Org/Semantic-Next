import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'UTC');

console.log(moment.set({ hour: 9, minute: 0 }).toString());
console.log(moment.set('year', 2030).toString());
console.log(moment.set('day', 1).toString());

// a part out of range refuses rather than rolling over
try {
  moment.set('minute', 60);
}
catch (error) {
  console.log(error.code);
}
