import { filterObject } from '@semantic-ui/utils';

const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = filterObject(obj, (value) => value % 2 === 0);
console.log(result);
