import { formatDate } from '@semantic-ui/utils';

const date = new Date('2023-12-25T15:30:00Z');

console.log(formatDate(date, 'YYYY-MM-DD'));
console.log(formatDate(date, 'MMM DD, YYYY'));
console.log(formatDate(date, 'HH:mm:ss'));

// named presets, uppercase for the full form
console.log(formatDate(date, 'LT'));
console.log(formatDate(date, 'LTS'));
console.log(formatDate(date, 'L'));
console.log(formatDate(date, 'LL'));
console.log(formatDate(date, 'LLL'));
console.log(formatDate(date, 'LLLL'));

// lowercase for the abbreviated form: l, ll, lll, llll
console.log(formatDate(date, 'lll'));

// square brackets pass through, otherwise the a in "at" formats as am/pm
console.log(formatDate(date, 'MMM D at h:mm a'));
console.log(formatDate(date, '[Posted] MMM D [at] h:mm a'));

// locale swaps the month and weekday names, the token string still fixes the order
console.log(formatDate(date, 'MMMM DD, YYYY', { locale: 'fr-FR' }));

// full IANA names, or a shorthand from formatDate.config.timezones
console.log(formatDate(date, 'YYYY-MM-DD HH:mm', { timezone: 'America/New_York' }));
console.log(formatDate(date, 'YYYY-MM-DD HH:mm', { timezone: 'PT' }));

// the import defaults to UTC. the {formatDate} template helper passes
// timezone: 'local', so in a template the same call reads the browser clock
console.log(formatDate(date, 'LTS'));
console.log(formatDate(date, 'LTS', { timezone: 'local' }));
