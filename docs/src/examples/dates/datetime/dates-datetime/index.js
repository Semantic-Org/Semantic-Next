import { datetime } from '@semantic-ui/dates';

// an instant, read in a zone
console.log(datetime('2026-09-06T14:30Z', 'America/New_York').format('long'));

// a wall clock in the zone it is given
console.log(datetime('2026-09-06T14:30', 'Asia/Tokyo').toString());

// a date alone is midnight
console.log(datetime('2026-09-06', 'UTC').toString());

// an offset fixes the instant, the zone stays the one asked for
console.log(datetime('2026-09-06T14:30:00+09:00', 'UTC').toString());
console.log(datetime('2026-09-06T14:30:00+09:00', 'UTC').zone);

// a bracketed zone in the string is the zone
console.log(datetime('2026-09-06T14:30:00+09:00[Asia/Tokyo]').zone);

// a Date, epoch milliseconds, or a fields object
console.log(datetime(new Date(0), 'UTC').toString());
console.log(datetime(0, 'UTC').toString());
console.log(datetime({ year: 2026, month: 9, day: 6, hour: 9 }, 'UTC').toString());
