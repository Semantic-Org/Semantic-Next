import { date, duration, hours } from '@semantic-ui/dates';

console.log(hours(-2).isNegative());
console.log(duration('-1h').isNegative());
console.log(hours(2).negated().isNegative());
console.log(hours(2).isNegative());
console.log(date('2026-03-01').until('2026-01-01').isNegative());
