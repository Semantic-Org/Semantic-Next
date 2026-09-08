import { date, tomorrow } from '@semantic-ui/dates';

const reference = date('2026-09-07');

console.log(date('2026-09-06').formatRelative(reference));
console.log(date('2026-09-07').formatRelative(reference));
console.log(date('2026-09-08').formatRelative(reference));
console.log(date('2026-09-21').formatRelative(reference));
console.log(date('2026-11-01').formatRelative(reference));
console.log(date('2020-01-01').formatRelative(reference));
console.log(date('2026-09-21').formatRelative(reference, 'de'));

// against today
console.log(tomorrow().formatRelative());
