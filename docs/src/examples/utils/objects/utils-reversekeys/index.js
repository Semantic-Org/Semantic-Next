import { reverseKeys } from '@semantic-ui/utils';

const obj = { a: '1', b: ['2', '3'] };
const result = reverseKeys(obj);
console.log(result);
