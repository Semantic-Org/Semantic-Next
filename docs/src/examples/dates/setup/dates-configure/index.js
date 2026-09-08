import { configure, date, datetime, now } from '@semantic-ui/dates';

configure({ zone: 'Europe/Berlin', locale: 'de-DE', weekStart: 'sunday' });

console.log(now().zone);
console.log(datetime('2026-09-06T14:30Z').format('long'));
console.log(date('2026-09-09').startOf('week').toString());

// a numeric date reads day first, as most of the world writes it
configure({ dayFirst: true });
console.log(date('07.09.2026', { loose: true }).toString());

// a name of your own that a zone answers to
configure({ zoneAliases: { hq: 'America/Los_Angeles' } });
console.log(datetime('2026-09-06T14:30Z').in('hq').zone);

// the settings in effect
console.log(configure());

// null resets a default to the machine's
configure({ zone: null, locale: null });
console.log(now().zone);
