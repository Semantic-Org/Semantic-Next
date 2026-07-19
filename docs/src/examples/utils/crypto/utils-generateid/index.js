import { generateId } from '@semantic-ui/utils';

console.log('--- Usage presets ---');
console.log('db (sortable ULID, default):', generateId());
console.log('page (letter-first DOM id):', generateId({ usage: 'page' }));
console.log('link (short, for URLs):', generateId({ usage: 'link' }));
console.log('token (secret + checksum):', generateId({ usage: 'token' }));
console.log('code (human-typed, grouped):', generateId({ usage: 'code' }));

console.log('\n--- Options ---');
console.log('prefix:', generateId({ usage: 'db', prefix: 'usr_' }));
console.log('length 12:', generateId({ length: 12 }));
console.log('group 4:', generateId({ usage: 'page', group: 4 }));
console.log('upper:', generateId({ usage: 'token', upper: true }));
console.log('uuid:', generateId({ format: 'uuid' }));

console.log('\n--- App-wide default ---');
generateId.config = { usage: 'page' };
console.log('config = page:', generateId());
