import { hashCode } from '@semantic-ui/utils';

console.log(hashCode('hello world'));
console.log(hashCode({ name: 'John', age: 30 }));
console.log(hashCode([1, 2, 3]));

// with prettify option
console.log(hashCode('test string', { prettify: true }));

// with custom seed
console.log(hashCode('same string', { seed: 123 }));
console.log(hashCode('same string', { seed: 456 }));

// UMASH mode for stronger collision resistance
console.log(hashCode('hello world', { fast: false }));
