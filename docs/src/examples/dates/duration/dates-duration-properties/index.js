import { date, duration } from '@semantic-ui/dates';

const length = duration('1h 30m 15s');

console.log(length.hours, length.minutes, length.seconds);
console.log(length.days, length.milliseconds);
console.log(length.sign);
console.log(duration('-2h').sign);

// a duration from until() remembers where it was measured from
console.log(duration('2h').anchor);
console.log(String(date('2026-01-01').until('2026-03-01').anchor));
