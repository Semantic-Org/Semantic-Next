import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.format());
console.log(day.format('short'));
console.log(day.format('long'));
console.log(day.format('full'));
console.log(day.format('month'));

console.log(day.format({ weekday: 'long', month: 'long', day: 'numeric' }));

console.log(day.format('MMMM Do, YYYY'));
console.log(day.format('YYYY-MM-DD'));
console.log(day.format('ddd D MMM', 'fr'));

// a date has no clock, so a clock token refuses
try {
  day.format('HH:mm');
}
catch (error) {
  console.log(error.code);
}
