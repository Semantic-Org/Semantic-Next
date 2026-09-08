import { date, tomorrow, yesterday } from '@semantic-ui/dates';

console.log(date('2100-01-01').isFuture());
console.log(tomorrow().isFuture());
console.log(yesterday().isFuture());
console.log(tomorrow('UTC').isFuture('UTC'));
