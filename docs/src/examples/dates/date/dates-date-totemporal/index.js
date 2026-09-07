import { date } from '@semantic-ui/dates';

const plain = date('2026-09-06').toTemporal();

console.log(plain instanceof Temporal.PlainDate);
console.log(plain.toString());
console.log(plain.dayOfWeek);
console.log(date(plain).equals('2026-09-06'));
