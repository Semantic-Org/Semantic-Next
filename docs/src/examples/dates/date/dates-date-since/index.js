import { date, today } from '@semantic-ui/dates';

console.log(date('2027-04-05').since('2026-01-01').toString());
console.log(date('2027-04-05').since('2026-01-01').format());
console.log(date('2027-04-05').since('2026-01-01', 'days'));
console.log(today().since('2026-01-01', 'days'));
