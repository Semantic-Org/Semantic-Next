import { date, duration, hours, months } from '@semantic-ui/dates';

console.log(hours(1).toMilliseconds());
console.log(duration('1h 30m').toMilliseconds());
console.log(duration('1w').toMilliseconds());
console.log(date('2026-01-01').until('2026-02-01').toMilliseconds());

// a duration is a number under the operators too
console.log(+hours(2));
console.log(hours(2) - hours(1));

try {
  months(1).toMilliseconds();
}
catch (error) {
  console.log(error.code);
}
