import { generateID } from '@semantic-ui/utils';

console.log('--- Usage presets ---');
console.log('db (sortable ULID, default):', generateID());
console.log('page (letter-first DOM id):', generateID({ usage: 'page' }));
console.log('link (short, for URLs):', generateID({ usage: 'link' }));
console.log('token (secret + checksum):', generateID({ usage: 'token' }));
console.log('code (human-typed, grouped):', generateID({ usage: 'code' }));

console.log('\n--- Options ---');
console.log('prefix:', generateID({ usage: 'db', prefix: 'usr_' }));
console.log('length 12:', generateID({ length: 12 }));
console.log('group 4:', generateID({ usage: 'page', group: 4 }));
console.log('upper:', generateID({ usage: 'token', upper: true }));
console.log('uuid:', generateID({ format: 'uuid' }));

console.log('\n--- App-wide default ---');
generateID.config = { usage: 'page' };
console.log('config = page:', generateID());
