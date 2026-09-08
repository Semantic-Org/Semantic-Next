import { days, now } from '@semantic-ui/dates';

console.log(now().plus(days(1)).isTomorrow());
console.log(now().isTomorrow());
console.log(now().plus(days(2)).isTomorrow());
