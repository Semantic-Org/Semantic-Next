import { clone } from '@semantic-ui/utils';

const original = { a: 1, b: { c: 2 } };
const cloned = clone(original);

console.log('original === cloned:', original === cloned);
console.log('original.b === cloned.b:', original.b === cloned.b);

cloned.b.c = 99;
console.log('original.b.c:', original.b.c);
console.log('cloned.b.c:', cloned.b.c);

console.log('clone([1, 2, 3]):', clone([1, 2, 3]));
console.log('clone(new Date()):', clone(new Date()));
