import { Reaction, Signal } from '@semantic-ui/reactivity';

const expensive = new Signal(0);

console.log('Has dependents:', expensive.hasDependents()); // false

const reaction = Reaction.create(() => {
  console.log('Value:', expensive.get());
});

console.log('Has dependents:', expensive.hasDependents()); // true

reaction.stop();
console.log('Has dependents:', expensive.hasDependents()); // false
