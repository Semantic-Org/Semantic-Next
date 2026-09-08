import { time } from '@semantic-ui/dates';

const plain = time('17:30').toTemporal();

console.log(plain instanceof Temporal.PlainTime);
console.log(plain.toString());
console.log(time(plain).equals('17:30'));
