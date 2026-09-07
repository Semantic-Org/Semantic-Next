import { date, days, hours, months } from '@semantic-ui/dates';

const day = date('2026-09-06');

console.log(day.plus(days(30)).toString());
console.log(day.plus({ weeks: 2 }).toString());
console.log(day.plus('1 month').toString());
console.log(day.plus(1, 'year').toString());

// month arithmetic stays within the days the month has
console.log(date('2026-01-31').plus(months(1)).toString());

// a date has no clock, so a clock unit refuses
try {
  day.plus(hours(3));
}
catch (error) {
  console.log(error.code);
}
