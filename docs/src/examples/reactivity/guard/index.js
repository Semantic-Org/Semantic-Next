import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

const counter = new ReactiveVar(0);

const isEven = () => Reaction.guard(() => {
  return (counter.get() % 2 === 0);
});

Reaction.create((comp) => {
  if(isEven()) {
    console.log(`${counter.peek()} is even`);
  }
});

counter.set(1); // No output guard is same
Reaction.flush();
counter.set(2); // Output
Reaction.flush();
counter.set(3); // No output guard is same

