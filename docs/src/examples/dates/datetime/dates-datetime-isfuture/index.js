import { datetime, days, now } from '@semantic-ui/dates';

console.log(datetime('2100-01-01T00:00Z').isFuture());
console.log(now().plus(days(1)).isFuture());
console.log(now().minus(days(1)).isFuture());
