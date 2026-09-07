import { generateId } from '@semantic-ui/utils';

console.log('--- Usage presets ---');
console.log('db (sortable ULID, default):', generateId());
console.log('page (letter-first DOM id):', generateId({ usage: 'page' }));
console.log('link (short, for URLs):', generateId({ usage: 'link' }));
console.log('token (unguessable + checksum):', generateId({ usage: 'token' }));
console.log('secret (256-bit credential):', generateId({ usage: 'secret' }));
console.log('code (human-typed, grouped):', generateId({ usage: 'code' }));

console.log('\n--- Options ---');
console.log('prefix:', generateId({ usage: 'db', prefix: 'usr_' }));
console.log('length 12:', generateId({ length: 12 }));
console.log('bits 512:', generateId({ usage: 'secret', bits: 512 }));
console.log('group 4:', generateId({ usage: 'page', group: 4 }));
console.log('upper:', generateId({ usage: 'token', upper: true }));
console.log('uuid:', generateId({ format: 'uuid' }));

console.log('\n--- App-wide default ---');
generateId.config = { usage: 'page' };
console.log('config = page:', generateId());
console.log('ignoreConfig (library code):', generateId({ ignoreConfig: true }));
