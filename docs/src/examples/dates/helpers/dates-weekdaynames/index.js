import { weekdayNames } from '@semantic-ui/dates';

console.log(weekdayNames());
console.log(weekdayNames(undefined, 'long'));
console.log(weekdayNames(undefined, 'short', 'sunday'));
console.log(weekdayNames('de-DE', 'long', 'sunday'));
console.log(weekdayNames('fr', 'short'));
