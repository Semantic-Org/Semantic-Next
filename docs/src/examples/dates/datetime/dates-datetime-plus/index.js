import { datetime, days, hours } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'UTC');

console.log(moment.plus(days(3)).toString());
console.log(moment.plus({ hours: 1, minutes: 30 }).toString());
console.log(moment.plus('1h 30m').toString());
console.log(moment.plus(2, 'weeks').toString());

// a count as text reads as its number, the way a form sends one
console.log(moment.plus('30', 'days').toString());

// adding days keeps the wall clock across a daylight saving change, adding hours counts hours
const friday = datetime('2026-03-06T17:00', 'America/New_York');
console.log(friday.plus(days(3)).format('dddd h:mm a'));
console.log(friday.plus(hours(72)).format('dddd h:mm a'));
