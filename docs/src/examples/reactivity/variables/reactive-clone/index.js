/*
  Signals default to safety: 'freeze' — the stored value is deep-frozen,
  so accidental in-place mutation throws at the call site.
  Pass safety: 'reference' to opt a signal out of freezing (e.g. when it
  holds third-party objects that mutate their own state).
*/
import { Reaction, Signal } from '@semantic-ui/reactivity';

const safe = new Signal(['apple', 'banana']);
const unsafe = new Signal(['apple', 'banana'], { safety: 'reference' });

Reaction.create(() => {
  console.log('Safe items:', safe.get());
});
Reaction.create(() => {
  console.log('Unsafe items:', unsafe.get());
});

// Correct way to add an item under either mode: use the mutation helper
safe.push('orange');
unsafe.push('orange');
Reaction.flush();

// Direct mutation on the reference: throws under freeze, silent no-op under reference
try {
  safe.get().push('cherry');
}
catch (e) {
  console.log('Caught:', e.message);
}

// Under reference, this mutates the stored array in place but does NOT notify subscribers
unsafe.get().push('cherry');
console.log('Unsafe after silent mutation:', unsafe.peek());
