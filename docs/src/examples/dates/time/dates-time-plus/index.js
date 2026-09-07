import { hours, time } from '@semantic-ui/dates';

console.log(time('09:00').plus(hours(2)).toString());
console.log(time('09:00').plus({ minutes: 45 }).toString());
console.log(time('09:00').plus('1h 30m').toString());
console.log(time('09:00').plus(15, 'minutes').toString());

// the clock wraps
console.log(time('23:00').plus(hours(2)).toString());
