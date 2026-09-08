import { minutes, time, timeRange } from '@semantic-ui/dates';

console.log(timeRange(time('9am'), time('5:30pm')).toString());
console.log(timeRange('9am', '5pm').toString());
console.log(timeRange('09:00/17:00').toString());
console.log(timeRange('9am - 5pm').toString());
console.log(timeRange('9am', minutes(90)).toString());
console.log(timeRange('09:00', { hours: 2 }).toString());

// an end before the start crosses midnight
console.log(timeRange('22:00', '06:00').duration.format());
