import { monthNames } from '@semantic-ui/dates';

console.log(monthNames());
console.log(monthNames(undefined, 'short'));
console.log(monthNames('fr', 'short'));
console.log(monthNames('ja'));
