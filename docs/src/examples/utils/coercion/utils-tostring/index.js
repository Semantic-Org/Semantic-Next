import { toString } from '@semantic-ui/utils';

console.log(toString(42));
console.log(toString(true));
console.log(toString({ a: 1 }));
console.log(toString({ a: 1 }, { loose: true }));
console.log(toString([1, 2], { loose: true }));
