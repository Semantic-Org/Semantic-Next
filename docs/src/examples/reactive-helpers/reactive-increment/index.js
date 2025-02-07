import { Signal, Reaction } from '@semantic-ui/reactivity';

const counter = new Signal(0);

Reaction.create((reaction) => {
  const count = counter.get();
  if(!reaction.firstRun) {
    console.log(`Counter: ${count}`);
  }
});

// Increment by 1
counter.increment();
Reaction.flush();
// Output: Counter: 1

// Increment by custom amount
counter.increment(2);
Reaction.flush();
// Output: Counter: 3
