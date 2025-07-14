import { isPlainObject } from '@semantic-ui/utils';

console.log(isPlainObject({}));
console.log(isPlainObject([]));
console.log(isPlainObject(new Date()));

class MyClass {}
console.log(isPlainObject(new MyClass()));
