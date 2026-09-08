import { duration, hours } from '@semantic-ui/dates';

const temporal = hours(1).toTemporal();

console.log(temporal instanceof Temporal.Duration);
console.log(temporal.toString());
console.log(temporal.total('minutes'));
console.log(duration(temporal).equals(hours(1)));
