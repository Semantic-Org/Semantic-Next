import { isFunction } from '@semantic-ui/utils';

function regularFunction() {}
const arrowFunction = () => {};
const asyncFunction = async () => {};

console.log(isFunction(regularFunction));
console.log(isFunction(arrowFunction));
console.log(isFunction(asyncFunction));
console.log(isFunction('not a function'));
console.log(isFunction({}));
