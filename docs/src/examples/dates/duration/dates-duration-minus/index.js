import { days, hours, minutes } from '@semantic-ui/dates';

console.log(hours(2).minus(minutes(30)).toString());
console.log(hours(2).minus('30m').toString());
console.log(minutes(30).minus(hours(2)).toString());

// a day less an hour has no one length, so it refuses
try {
  days(1).minus(hours(1));
}
catch (error) {
  console.log(error.code);
}
