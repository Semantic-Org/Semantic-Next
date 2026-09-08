import { date, days, hours, minutes } from '@semantic-ui/dates';

console.log(hours(1).compare(minutes(90)));
console.log(hours(1).compare('60m'));
console.log(hours(2).compare(minutes(90)));

// a measured duration compares through its calendar
console.log(date('2026-01-01').until('2026-02-01').compare(days(31)));
console.log(date('2026-02-01').until('2026-03-01').compare(days(31)));
