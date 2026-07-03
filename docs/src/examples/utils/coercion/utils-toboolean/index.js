import { toBoolean } from '@semantic-ui/utils';

console.log(toBoolean('yes'));
console.log(toBoolean('off'));
console.log(toBoolean('1'));
console.log(toBoolean('banana'));
console.log(toBoolean('banana', { loose: true }));
console.log(toBoolean('nope', { falsy: ['nope'] }));
