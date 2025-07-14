/*
  By default accidental mutations are protected because set/get are cloned
  using allowClone: false will remove this protection but avoid cloning overhead
*/
import { Reaction, Signal } from '@semantic-ui/reactivity';

const safeItems = new Signal(['apple', 'banana']);
const unsafeItems = new Signal(['apple', 'banana'], { allowClone: false });

Reaction.create(() => {
  console.log('Safe items:', safeItems.get());
});
Reaction.create(() => {
  console.log('Unsafe items:', unsafeItems.get());
});

console.log('--- Accidental mutation ---');

// Get references and try to mutate them
const safeRef = safeItems.get();
const unsafeRef = unsafeItems.get();

// somewhere else in code accidentally mutate the copy
safeRef.push('cherry');
unsafeRef.push('cherry');

safeItems.push('orange');
unsafeItems.push('orange');
Reaction.flush();
