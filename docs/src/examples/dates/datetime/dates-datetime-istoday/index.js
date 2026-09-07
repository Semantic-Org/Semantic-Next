import { datetime, days, now } from '@semantic-ui/dates';

console.log(now().isToday());
console.log(now().plus(days(1)).isToday());
console.log(datetime('2000-01-01T00:00Z').isToday());
