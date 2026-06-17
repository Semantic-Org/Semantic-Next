import { generateID, parseID } from '@semantic-ui/utils';

console.log('--- A db id decodes its creation time ---');
const id = generateID({ usage: 'db', prefix: 'doc_' });
const parsed = parseID(id, { usage: 'db', prefix: 'doc_' });
console.log('prefix:', parsed.prefix);
console.log('body:', parsed.body);
console.log('timestamp:', parsed.timestamp);

console.log('\n--- A token splits into body and checksum ---');
const token = generateID({ usage: 'token', prefix: 'sk_' });
console.log('parsed:', parseID(token, { usage: 'token', prefix: 'sk_' }));

console.log('\n--- An invalid id returns null ---');
console.log('parsed:', parseID('not-a-real-id', { usage: 'db' }));
