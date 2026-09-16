import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30:15.250', 'America/New_York');

// the same number a Date gives
console.log(moment.getTime());

// Date's own conventions, a month from 0 and sunday as 0, read in the value's zone
console.log(moment.getFullYear(), moment.getMonth(), moment.getDate(), moment.getDay());
console.log(moment.getHours(), moment.getMinutes(), moment.getSeconds());

// minutes west of UTC
console.log(moment.getTimezoneOffset());

// the UTC family reads in UTC
console.log(moment.getUTCHours());

console.log(moment.toISOString());
console.log(moment.toLocaleDateString('en-US'));
console.log(moment.toLocaleTimeString('en-US'));

// a DateTime never changes in place
try {
  moment.setHours(9);
}
catch (error) {
  console.log(error.code, error.message);
}
