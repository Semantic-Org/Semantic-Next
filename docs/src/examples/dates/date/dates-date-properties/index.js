import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

// spelled the way a Date prints, the line a console preview leads with
console.log(day.text);

console.log(day.year, day.month, day.day);

// ISO weekday, 1 for monday through 7 for sunday
console.log(day.weekday);

console.log(day.quarter, day.dayOfYear, day.weekOfYear);
console.log(day.daysInMonth, day.daysInYear);
