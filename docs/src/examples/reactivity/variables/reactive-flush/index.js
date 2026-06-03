import { flush, reaction, signal } from '@semantic-ui/reactivity';

let number = signal(0);

reaction(() => {
  console.log(`Called with ${number.get()}`);
});

// Because intermediate values are each flushed
// each will resolve in the reaction
[1, 2, 3, 4, 5].forEach(value => {
  number.set(value);
  flush();
});
