import { extend } from '@semantic-ui/utils';

const copyTo = { a: 1, b: 2 };
const copyFrom1 = { c: 3 };
const copyFrom2 = { d: 4 };

console.log('Before:', copyTo);
extend(copyTo, copyFrom1, copyFrom2);
console.log('After:', copyTo);
