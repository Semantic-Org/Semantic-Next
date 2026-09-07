import { date, time } from '@semantic-ui/dates';

const visit = date('2026-11-03').at('9:30am', 'America/Los_Angeles');

console.log(visit.toString());
console.log(visit.zone);
console.log(visit.format('long'));

console.log(date('2026-11-03').at(time('17:00'), 'UTC').toString());

// no time is midnight
console.log(date('2026-11-03').at().hour);
