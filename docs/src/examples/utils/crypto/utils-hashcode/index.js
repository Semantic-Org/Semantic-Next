import { hashCode } from '@semantic-ui/utils';

console.log('--- Usage presets ---');
console.log('hash (53-bit number, default):', hashCode('hello world'));
console.log('content (64-bit string):', hashCode('hello world', { usage: 'content' }));
console.log('fingerprint (128-bit string):', hashCode('hello world', { usage: 'fingerprint' }));
console.log('secure (async SHA-256):', await hashCode('hello world', { usage: 'secure' }));

console.log('\n--- Options ---');
console.log('content as hex:', hashCode('hello world', { usage: 'content', format: 'hex' }));
console.log('seeds give independent hashes:', hashCode('same', { seed: 123 }) === hashCode('same', { seed: 456 }));
console.log('objects hash by content:', hashCode({ name: 'John', age: 30 }));

console.log('\n--- App-wide default ---');
hashCode.config = { usage: 'content' };
console.log('config = content:', hashCode('hello world'));
