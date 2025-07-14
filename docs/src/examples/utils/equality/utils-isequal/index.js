import { isEqual } from '@semantic-ui/utils';

console.log(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));
console.log(isEqual([1, 2, 3], [1, 2, 3]));
console.log(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));
console.log(isEqual(NaN, NaN));
console.log(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 }));
