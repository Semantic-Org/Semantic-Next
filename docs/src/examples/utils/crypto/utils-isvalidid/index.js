import { generateId, isValidId } from '@semantic-ui/utils';

const id = generateId({ usage: 'token', prefix: 'sk_' });
const typo = id.slice(0, 6) + (id[6] === 'a' ? 'b' : 'a') + id.slice(7);
const dbId = generateId();

console.log('valid id matches its config:', isValidId(id, { usage: 'token', prefix: 'sk_' }));
console.log('checksum catches a typo:', isValidId(typo, { usage: 'token', prefix: 'sk_' }));
console.log('reads loose (case, I/L/O, hyphens):', isValidId(dbId.toLowerCase(), { usage: 'db' }));
console.log('wrong usage fails fast:', isValidId(id, { usage: 'page' }));
console.log('missing prefix fails fast:', isValidId(id, { usage: 'token' }));
