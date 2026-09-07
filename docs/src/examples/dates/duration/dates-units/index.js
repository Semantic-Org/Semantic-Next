import { date, days, hours, milliseconds, minutes, months, seconds, weeks, years } from '@semantic-ui/dates';

console.log(years(1).toString());
console.log(months(6).toString());
console.log(weeks(2).toString());
console.log(days(30).toString());
console.log(hours(8).toString());
console.log(minutes(90).toString());
console.log(seconds(30).toString());
console.log(milliseconds(250).toString());

// a count as text reads as its number, the way a form sends one
console.log(days('30').toString());

// they compose
console.log(hours(2).plus(minutes(30)).format());
console.log(date('2026-09-01').plus(days(30)).toString());
