import { reactiveObject } from '@semantic-ui/reactivity';

// seed the counter to align with an external store's revision
const doc = reactiveObject({ a: 1 }, { version: 10 });

console.log('start:', doc.version); // 10

doc.set('a', 2);
console.log('after set:', doc.version); // 11

doc.set('a', 2); // equal value, no-op, no bump
console.log('after no-op set:', doc.version); // 11

doc.replace({ a: 2 }); // replace bumps unconditionally, even with nothing observable changed
console.log('after replace:', doc.version); // 12
