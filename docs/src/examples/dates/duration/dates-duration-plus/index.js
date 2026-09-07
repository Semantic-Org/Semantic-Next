import { days, hours, minutes, months } from '@semantic-ui/dates';

console.log(hours(2).plus(minutes(30)).toString());
console.log(hours(2).plus('30m').toString());
console.log(hours(2).plus({ minutes: 30 }).toString());
console.log(hours(2).plus(30, 'minutes').toString());

// days stay apart from hours, since a day is a calendar unit
console.log(days(1).plus(hours(25)).toString());
console.log(months(1).plus(days(3)).toString());
