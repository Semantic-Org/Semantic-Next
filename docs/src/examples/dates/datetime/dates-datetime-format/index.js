import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'UTC');

console.log(moment.format());
console.log(moment.format('short'));
console.log(moment.format('long'));
console.log(moment.format('full'));
console.log(moment.format('date'));
console.log(moment.format('time'));

// Intl options, which may name their own zone
console.log(moment.format({ weekday: 'long', hour: 'numeric' }));
console.log(moment.format({ timeStyle: 'short', timeZone: 'Asia/Tokyo' }));

// day.js tokens, square brackets pass through
console.log(moment.format('YYYY-MM-DD HH:mm'));
console.log(moment.format('dddd, MMMM Do YYYY [at] h:mm a'));
console.log(moment.format('YYYY-MM-DD HH:mm:ss.SSS Z'));
console.log(moment.format('h:mm A z'));

// a locale for one call
console.log(moment.format('dddd D MMMM', 'de'));
console.log(moment.format('long', 'fr-FR'));
