import { Signal, Reaction } from '@semantic-ui/reactivity';

let number = new Signal(0);

// add reactive reference to trigger a flush
Reaction.create(() => {
  number.get();
});

// update reactive reference
[1, 2, 3, 4, 5].forEach(value => {
  number.set(value);
});

// afterFlush occurs after final value is set
Reaction.afterFlush(() => {
  console.log(`The final value is ${number.get()}`);
});
