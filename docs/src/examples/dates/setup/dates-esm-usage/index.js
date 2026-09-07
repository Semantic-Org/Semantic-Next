import { date, days } from '@semantic-ui/dates';

const due = date('2026-09-01').plus(days(30));

console.log(due.toString());
console.log(due.format('long'));
