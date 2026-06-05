// Reaction Stop: Stopping reactive computations
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const counter = signal(0);

// Create a reaction
const handle = reaction(() => {
  console.log('Counter:', counter.get());
});

// Update counter - reaction runs
counter.set(5);
flush();

// Stop the reaction
handle.stop();
console.log('Reaction stopped');

// Update counter - reaction does NOT run
counter.set(10);
flush();

console.log('Final counter value:', counter.get());
