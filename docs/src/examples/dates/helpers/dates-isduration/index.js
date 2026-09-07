import { date, duration, hours, isDuration } from '@semantic-ui/dates';

console.log(isDuration(hours(1)));
console.log(isDuration(duration('1h 30m')));
console.log(isDuration(date('2026-01-01').until('2026-02-01')));
console.log(isDuration(date('2026-01-01')));
console.log(isDuration(new Date()));
console.log(isDuration('PT1H'));
