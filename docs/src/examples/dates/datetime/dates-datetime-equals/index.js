import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30Z', 'UTC');

console.log(moment.equals('2026-09-06T14:30:00Z'));
console.log(moment.equals(moment.in('Asia/Tokyo')));
console.log(moment.equals(datetime('2026-09-06T23:30', 'Asia/Tokyo')));
console.log(moment.equals('2026-09-06T14:31Z'));
