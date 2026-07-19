import { generateId, parseId } from '@semantic-ui/utils';

console.log('--- A db id decodes its creation time ---');
const id = generateId({ usage: 'db', prefix: 'doc_' });
const parsed = parseId(id, { usage: 'db', prefix: 'doc_' });
console.log('prefix:', parsed.prefix);
console.log('body:', parsed.body);
console.log('timestamp:', parsed.timestamp);

console.log('\n--- A token splits into body and checksum ---');
const token = generateId({ usage: 'token', prefix: 'sk_' });
console.log('parsed:', parseId(token, { usage: 'token', prefix: 'sk_' }));

console.log('\n--- An invalid id returns null ---');
console.log('parsed:', parseId('not-a-real-id', { usage: 'db' }));
