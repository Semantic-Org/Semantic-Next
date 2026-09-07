import { time } from '@semantic-ui/dates';

console.log(time('17:30').toString());
console.log(time('17:30:15.25').toString());
console.log(time('17:30:15.000250').toString());
console.log(`Opens ${time('9am')}`);

// a time is not a number, so < refuses rather than being silently wrong
try {
  time('9am') < time('5pm');
}
catch (error) {
  console.log(error.code);
}
