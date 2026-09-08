import { duration, hours } from '@semantic-ui/dates';

console.log(duration(0).isZero());
console.log(hours(0).isZero());
console.log(hours(1).minus('60m').isZero());
console.log(hours(1).isZero());
