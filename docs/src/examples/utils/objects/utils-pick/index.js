import { onlyKeys, pick } from '@semantic-ui/utils';

const obj = { a: 1, b: 2, c: 3, d: 4 };

// spread the keys you want
console.log(pick(obj, 'a', 'c'));

// or hand over an array when the keys are already in one
console.log(onlyKeys(obj, ['a', 'c']));
