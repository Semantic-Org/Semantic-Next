import { date, datetime, latest, time } from '@semantic-ui/dates';

console.log(latest('2026-09-06', '2026-01-01', '2027-01-01').toString());
console.log(latest([date('2026-09-06'), date('2026-01-01')]).toString());
console.log(latest(time('9am'), time('5pm')).toString());
console.log(latest(datetime('2026-09-06T14:30Z'), datetime('2026-09-07T14:30Z')).toString());
