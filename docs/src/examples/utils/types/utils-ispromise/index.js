import { isPromise } from '@semantic-ui/utils';

const promise = new Promise(resolve => resolve('value'));
const asyncFunction = async () => 'value';
const thenableObject = { then: () => {} };
const regularObject = { value: 'test' };

console.log(isPromise(promise));
console.log(isPromise(asyncFunction()));
console.log(isPromise(thenableObject));
console.log(isPromise(regularObject));
