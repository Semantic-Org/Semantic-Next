import { datetime } from '@semantic-ui/dates';

console.log(datetime('2026-09-06T14:30', 'UTC').toString());
console.log(datetime('2026-09-06T10:30', 'America/New_York').toString());

// sub-millisecond digits print only when the value has them
console.log(datetime('2026-09-06T14:30:00.123456Z').toString());

// + gives the string, as Date decides it
console.log('Due ' + datetime('2026-09-06T14:30Z'));
