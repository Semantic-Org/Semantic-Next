import { escapeHTML, unescapeHTML } from '@semantic-ui/utils';

const escaped = '&lt;div&gt;Hello &quot;World&quot;&lt;/div&gt;';
console.log('Escaped:', escaped);
console.log('Unescaped:', unescapeHTML(escaped));

console.log('Ampersands:', unescapeHTML('rock &amp; roll'));

// Round-trip: escape then unescape
const original = '<script>alert("XSS")</script>';
const roundTrip = unescapeHTML(escapeHTML(original));
console.log('Round-trip:', roundTrip === original);
