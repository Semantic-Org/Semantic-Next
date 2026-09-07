import { weekdayNames } from '@semantic-ui/dates';

console.log(weekdayNames());
console.log(weekdayNames('long'));
console.log(weekdayNames('short', 'sunday'));
console.log(weekdayNames('long', 'sunday', 'de-DE'));
console.log(weekdayNames('short', undefined, 'fr'));
