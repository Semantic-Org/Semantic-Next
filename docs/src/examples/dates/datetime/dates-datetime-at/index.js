import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'America/New_York');

console.log(moment.at('9am').format('long'));
console.log(moment.at('17:45').toString());
console.log(moment.at('12:00').format('time'));
