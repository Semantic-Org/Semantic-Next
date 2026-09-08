import { time } from '@semantic-ui/dates';

const moment = time('17:30');

console.log(moment.format());
console.log(moment.format('short'));
console.log(moment.format('medium'));
console.log(moment.format({ hour: '2-digit', minute: '2-digit', hour12: false }));
console.log(moment.format('HH:mm'));
console.log(moment.format('h:mm a'));
console.log(moment.format('short', 'de-DE'));
