import { isClassInstance } from '@semantic-ui/utils';

class MyClass {}
class AnotherClass {}

const plainObject = {};
const array = [];
const date = new Date();
const myInstance = new MyClass();
const anotherInstance = new AnotherClass();

console.log(isClassInstance(plainObject));
console.log(isClassInstance(array));
console.log(isClassInstance(date));
console.log(isClassInstance(myInstance));
console.log(isClassInstance(anotherInstance));
