import { flush, reaction, signal } from '@semantic-ui/reactivity';

const numbers = signal([1, 2, 3, 4, 5]);

// derive a new signal from one source
const count = numbers.derive(arr => arr.length);

reaction(() => {
  console.log('Count:', count.get());
});

numbers.push(6);
flush();

numbers.splice(0, 2);
flush();
