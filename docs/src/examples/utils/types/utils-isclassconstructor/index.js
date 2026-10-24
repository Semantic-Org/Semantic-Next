import { isClassConstructor } from '@semantic-ui/utils';

class MyClass {}
class SubClass extends MyClass {}
function plainFunction() {}
const arrowFunction = () => {};

console.log(isClassConstructor(MyClass));
console.log(isClassConstructor(SubClass));
console.log(isClassConstructor(plainFunction));
console.log(isClassConstructor(arrowFunction));
console.log(isClassConstructor(Date));
console.log(isClassConstructor(new MyClass()));
