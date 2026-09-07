import { date, days, duration, hours, minutes, months } from '@semantic-ui/dates';

console.log(minutes(90).total('hours'));
console.log(duration('1w').total('days'));
console.log(days(14).total('weeks'));
console.log(hours(1).total('seconds'));

// a duration from until() knows its calendar
console.log(date('2026-01-01').until('2026-07-01').total('months'));
console.log(date('2026-01-01').until('2027-01-01').total('years'));

try {
  months(1).total('days');
}
catch (error) {
  console.log(error.code);
}
