import { duration, hours, minutes, months } from '@semantic-ui/dates';

console.log(hours(1).equals(minutes(60)));
console.log(duration('PT90M').equals('1h 30m'));
console.log(months(1).equals(months(1)));
console.log(hours(1).equals(minutes(61)));
