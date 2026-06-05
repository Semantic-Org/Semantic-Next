import { afterFlush, reaction, signal } from '@semantic-ui/reactivity';

let number = signal(0);

// add reactive reference to trigger a flush
reaction(() => {
  number.get();
});

// update reactive reference
[1, 2, 3, 4, 5].forEach(value => {
  number.set(value);
});

// afterFlush occurs after final value is set
afterFlush(() => {
  console.log(`The final value is ${number.get()}`);
});
