import { minutes, time } from '@semantic-ui/dates';

console.log(time('9am').to('5:30 pm').toString());
console.log(time('9am').to(minutes(90)).toString());
console.log(time('9am').to('8h').toString());
console.log(time('9am').to(8, 'hours').contains('17:00'));

// an end before the start crosses midnight
console.log(time('22:00').to('06:00').duration.format());
