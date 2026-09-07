import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30Z', 'UTC');

console.log(moment.in('America/New_York').format('long'));
console.log(moment.in('Asia/Tokyo').format('long'));

// a city or an abbreviation names a zone too
console.log(moment.in('Berlin').zone);
console.log(moment.in('PT').zone);

// the instant does not move
console.log(moment.in('Asia/Tokyo').equals(moment));
console.log(moment.in('Asia/Tokyo').toString());
