import { toNumber } from '@semantic-ui/utils';

console.log(toNumber('3.14'));
console.log(toNumber('  42 '));
console.log(toNumber('5px'));
console.log(toNumber('1e999'));
console.log(toNumber('abc') ?? 0);
