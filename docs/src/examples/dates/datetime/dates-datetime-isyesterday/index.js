import { days, now } from '@semantic-ui/dates';

console.log(now().minus(days(1)).isYesterday());
console.log(now().isYesterday());
console.log(now().minus(days(2)).isYesterday());
