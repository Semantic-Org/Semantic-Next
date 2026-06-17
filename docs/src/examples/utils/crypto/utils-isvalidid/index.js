import { generateID, isValidID } from '@semantic-ui/utils';

const id = generateID({ usage: 'token', prefix: 'sk_' });

// a freshly minted id validates against the config that made it
console.log(isValidID(id, { usage: 'token', prefix: 'sk_' }));

// the checksum catches a single-character typo
const typo = id.slice(0, 6) + (id[6] === 'a' ? 'b' : 'a') + id.slice(7);
console.log(isValidID(typo, { usage: 'token', prefix: 'sk_' }));

// reads loose — case, I/L/O, and hyphens are all forgiven
const dbId = generateID();
console.log(isValidID(dbId.toLowerCase(), { usage: 'db' }));

// the wrong usage or a missing prefix fails fast, before any lookup
console.log(isValidID(id, { usage: 'page' }));
console.log(isValidID(id, { usage: 'token' }));
