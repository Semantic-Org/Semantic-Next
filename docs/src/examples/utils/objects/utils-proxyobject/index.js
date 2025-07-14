import { proxyObject } from '@semantic-ui/utils';

// sourceObj must be a function that returns the source object
const source = () => ({ a: 1, b: 2 });
const reference = { c: 3 };
const proxy = proxyObject(source, reference);

console.log(proxy.a);
console.log(proxy.c);
