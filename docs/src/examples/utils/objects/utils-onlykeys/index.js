import { onlyKeys } from '@semantic-ui/utils';

const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = onlyKeys(obj, ['a', 'c']);
console.log(result);
