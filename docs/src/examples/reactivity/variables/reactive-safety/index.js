import { flush, reaction, signal } from '@semantic-ui/reactivity';

// reference (the default): stores by reference, the fast path for most signals
const draft = { label: 'draft' };
const referenced = signal(draft);
draft.label = 'edited'; // mutate the original behind the signal
console.log(referenced.get().label);

// the leak runs both ways, what get() hands back is the live value
referenced.get().label = 'edited via get';
console.log(referenced.peek().label);

// clone: stores and returns copies, guarding state outside code might mutate
const saved = { label: 'draft' };
const cloned = signal(saved, { safety: 'clone' });
saved.label = 'edited';
console.log(cloned.get().label);

// none: skips the equality check so every set re-fires (same as equality: () => false)
const stream = signal(0, { safety: 'none' });
let runs = 0;
reaction(() => {
  stream.get();
  runs++;
});
stream.set(0); // an equal value still re-fires under none
flush();
console.log(runs);
