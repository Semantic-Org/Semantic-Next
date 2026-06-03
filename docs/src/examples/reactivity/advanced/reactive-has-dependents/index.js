import { reaction, signal } from '@semantic-ui/reactivity';

const expensive = signal(0);

console.log('Has dependents:', expensive.hasDependents()); // false

const handle = reaction(() => {
  console.log('Value:', expensive.get());
});

console.log('Has dependents:', expensive.hasDependents()); // true

handle.stop();
console.log('Has dependents:', expensive.hasDependents()); // false
