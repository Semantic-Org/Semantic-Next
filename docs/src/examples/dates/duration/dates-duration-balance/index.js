import { duration, hours, minutes, months, seconds } from '@semantic-ui/dates';

console.log(minutes(150).balance().toString());
console.log(seconds(3661).balance().toString());
console.log(duration('90m').balance().format());

// a length stops at hours, since a day is a calendar unit
console.log(hours(36).balance().toString());
console.log(hours(36).balance('day').toString());
console.log(duration('10d').balance('week').toString());

// a month has no fixed length, so it needs a duration from until()
try {
  months(1).balance('day');
}
catch (error) {
  console.log(error.code);
}
