import { Signal, Reaction } from '@semantic-ui/reactivity';

const counter = new Signal(0);

Reaction.create((reaction) => {
  const count = counter.get();
  if(!reaction.firstRun) {
    console.log(`Counter: ${count}`);
  }
});

counter.increment(); // Increment by 1
Reaction.flush();
counter.increment(10); // Increment by 10
