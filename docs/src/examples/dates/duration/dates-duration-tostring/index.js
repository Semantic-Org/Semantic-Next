import { duration, hours } from '@semantic-ui/dates';

console.log(duration('1h 30m').toString());
console.log(duration('90m').toString());
console.log(duration('90m').balance().toString());
console.log(duration(1500).toString());
console.log('Takes ' + hours(2));
