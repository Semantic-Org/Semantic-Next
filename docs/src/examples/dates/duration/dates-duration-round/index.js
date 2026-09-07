import { duration, minutes, seconds } from '@semantic-ui/dates';

console.log(minutes(90).round('hour').toString());
console.log(seconds(95).round('minute').toString());
console.log(duration('1h 29m').round('hour').toString());
