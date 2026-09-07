import { hours } from '@semantic-ui/dates';

console.log(hours(2).negated().toString());
console.log(hours(2).negated().isNegative());
console.log(hours(-2).negated().toString());
