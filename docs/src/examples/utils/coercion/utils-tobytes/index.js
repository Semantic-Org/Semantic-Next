import { toBytes } from '@semantic-ui/utils';

console.log(toBytes('héllo'));
console.log(toBytes(new Float32Array([1])));
console.log(toBytes([1, 2, 3]));
console.log(toBytes([1, 2, 300]));
console.log(toBytes(5));
