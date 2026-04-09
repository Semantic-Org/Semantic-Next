import { Reaction, Signal } from '@semantic-ui/reactivity';

const data = new Signal({ count: 0 }, { allowClone: false });

Reaction.create(() => {
  console.log('Count:', data.get().count);
});

// Mutate the object externally — the reference hasn't changed
data.peek().count = 5;

// set() wouldn't trigger because the reference is the same object
// notify() forces subscribers to re-run
data.notify();
Reaction.flush();

data.peek().count = 10;
data.notify();
