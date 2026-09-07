import { duration, hours, minutes } from '@semantic-ui/dates';

console.log(duration('1h 30m').toFields());
console.log(duration('P1Y2M3DT4H').toFields());
console.log(hours(2).plus(minutes(30)).toFields());
console.log(duration(0).toFields());
