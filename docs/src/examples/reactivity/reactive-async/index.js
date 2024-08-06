import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

let number = new ReactiveVar(0);

Reaction.create(() => {
  console.log(`Called with ${number.get()}`);
});

// Because values are set immediately intermediate values are not flushed
// So only the first and the last value will be logged
[1, 2, 3, 4, 5].forEach(value => number.set(value));

