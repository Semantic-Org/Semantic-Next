import { flush, reaction, signal } from '@semantic-ui/reactivity';

const data = signal({ count: 0 });

reaction(() => {
  console.log('Count:', data.get().count);
});

// mutate the stored object in place — the reference is unchanged
data.peek().count = 5;
// set() would no-op on the same reference, so notify() forces the re-run
data.notify();
flush();

data.peek().count = 10;
data.notify();
