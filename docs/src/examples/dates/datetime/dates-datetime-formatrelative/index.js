import { datetime, hours, now } from '@semantic-ui/dates';

const reference = datetime('2026-09-07T14:00Z', 'UTC');

console.log(datetime('2026-09-07T13:59:30Z').formatRelative(reference));
console.log(datetime('2026-09-07T13:00Z').formatRelative(reference));
console.log(datetime('2026-09-06T14:00Z').formatRelative(reference));
console.log(datetime('2026-09-09T14:00Z').formatRelative(reference));
console.log(datetime('2026-08-01T14:00Z').formatRelative(reference));
console.log(datetime('2026-09-09T14:00Z').formatRelative(reference, 'es'));

// against now
console.log(now().minus(hours(3)).formatRelative());
