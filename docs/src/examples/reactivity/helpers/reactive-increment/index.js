import { flush, reaction, signal } from '@semantic-ui/reactivity';

const counter = signal(0);

reaction((computation) => {
  const count = counter.get();
  if (!computation.firstRun) {
    console.log(`Counter: ${count}`);
  }
});

counter.increment(); // Increment by 1
flush();
counter.increment(10); // Increment by 10
