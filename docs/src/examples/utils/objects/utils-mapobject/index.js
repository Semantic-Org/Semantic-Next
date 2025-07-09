import { mapObject } from '@semantic-ui/utils';

const obj = { a: 1, b: 2, c: 3 };
const result = mapObject(obj, (value) => value * 2);
console.log(result);
