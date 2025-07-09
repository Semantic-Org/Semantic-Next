import { isObject } from '@semantic-ui/utils';

console.log(isObject({}));
console.log(isObject([]));
console.log(isObject(null));
console.log(isObject('string'));
console.log(isObject(42));
