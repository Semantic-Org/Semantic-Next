import { duration, hours, minutes } from '@semantic-ui/dates';

const length = hours(2).plus(minutes(30));

console.log(length.format());
console.log(length.format('short'));
console.log(length.format('narrow'));
console.log(length.format('digital'));
console.log(length.format('long', 'ja'));
console.log(length.format('long', 'de'));

// a stored count of milliseconds prints balanced
console.log(duration(93784512).format());
console.log(duration(0).format());
