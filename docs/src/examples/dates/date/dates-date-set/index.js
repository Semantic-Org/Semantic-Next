import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.set({ day: 1 }).toString());
console.log(day.set('month', 12).toString());
console.log(day.set('year', 2030).toString());

try {
  date('2026-02-01').set({ day: 30 });
}
catch (error) {
  console.log(error.code);
}
