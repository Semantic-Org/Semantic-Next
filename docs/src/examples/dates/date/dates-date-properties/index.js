import { date } from '@semantic-ui/dates';

const day = date('2026-09-06');

// the configured locale's common form, the line a console preview leads with
console.log(day.text);

console.log(day.month, day.day, day.year);

// ISO weekday, 1 for monday through 7 for sunday
console.log(day.weekday);

console.log(day.quarter, day.dayOfYear, day.weekOfYear);
console.log(day.daysInMonth, day.daysInYear);
