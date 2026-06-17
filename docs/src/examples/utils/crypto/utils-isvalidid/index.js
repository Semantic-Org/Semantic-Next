import { generateID, isValidID } from '@semantic-ui/utils';

const id = generateID({ usage: 'token', prefix: 'sk_' });
const typo = id.slice(0, 6) + (id[6] === 'a' ? 'b' : 'a') + id.slice(7);
const dbId = generateID();

console.log('valid id matches its config:', isValidID(id, { usage: 'token', prefix: 'sk_' }));
console.log('checksum catches a typo:', isValidID(typo, { usage: 'token', prefix: 'sk_' }));
console.log('reads loose (case, I/L/O, hyphens):', isValidID(dbId.toLowerCase(), { usage: 'db' }));
console.log('wrong usage fails fast:', isValidID(id, { usage: 'page' }));
console.log('missing prefix fails fast:', isValidID(id, { usage: 'token' }));
