import { generateID, parseID } from '@semantic-ui/utils';

// a db id carries its creation time — parseID decodes it, no column needed
const id = generateID({ usage: 'db', prefix: 'doc_' });
const parsed = parseID(id, { usage: 'db', prefix: 'doc_' });
console.log(parsed.prefix);
console.log(parsed.body);
console.log(parsed.timestamp);

// a token splits into body and checksum
const token = generateID({ usage: 'token', prefix: 'sk_' });
console.log(parseID(token, { usage: 'token', prefix: 'sk_' }));

// an invalid id returns null
console.log(parseID('not-a-real-id', { usage: 'db' }));
