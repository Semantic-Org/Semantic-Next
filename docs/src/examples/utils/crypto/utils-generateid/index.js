import { generateID } from '@semantic-ui/utils';

// default — a sortable 26-char ULID for database records
console.log(generateID());

// usage presets carry the right length and shape per channel
console.log(generateID({ usage: 'page' })); // 8 chars, letter-first, for DOM ids
console.log(generateID({ usage: 'slug' })); // 11 chars, for URLs
console.log(generateID({ usage: 'token' })); // 27 chars with a checksum

// typed prefix, the Stripe / GitHub convention
console.log(generateID({ usage: 'db', prefix: 'usr_' }));

// explicit length and grouped display
console.log(generateID({ length: 12 }));
console.log(generateID({ usage: 'page', group: 4 }));

// RFC UUIDv7 escape hatch
console.log(generateID({ format: 'uuid' }));

// set an app-wide default
generateID.config = { usage: 'page' };
console.log(generateID());
