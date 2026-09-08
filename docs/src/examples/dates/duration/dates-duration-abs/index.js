import { duration, hours } from '@semantic-ui/dates';

console.log(hours(-2).abs().toString());
console.log(duration('-1h 30m').abs().format());
console.log(hours(2).abs().toString());
