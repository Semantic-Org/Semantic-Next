import { date } from '@semantic-ui/dates';

console.log(date('2026-09-06').toString());
console.log(String(date(2026, 9, 6)));
console.log(`Due ${date('2026-09-06')}`);

// a date is not a number, so < refuses rather than being silently wrong
try {
  date('2026-09-06') < date('2026-09-07');
}
catch (error) {
  console.log(error.code);
}
