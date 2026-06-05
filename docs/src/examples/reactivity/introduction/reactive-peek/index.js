import { flush, reaction, signal } from '@semantic-ui/reactivity';

const counter = signal(0);
const multiplier = signal(2);

reaction(() => {
  const count = counter.get();
  const multi = multiplier.peek(); // peek reads without subscribing
  console.log(`${count} x ${multi} = ${count * multi}`);
});

counter.set(5);
flush();

multiplier.set(10);
console.log('Multiplier changed but reaction did not run');

counter.set(7);
