import { pick } from '@semantic-ui/utils';

const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = pick(obj, 'a', 'c');
console.log(result);
