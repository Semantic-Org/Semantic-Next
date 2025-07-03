// Reaction Stop: Stopping reactive computations
import { Reaction, Signal } from '@semantic-ui/reactivity';

const counter = new Signal(0);

// Create a reaction
const reaction = Reaction.create(() => {
  console.log('Counter:', counter.get());
});

// Update counter - reaction runs
counter.set(5);
Reaction.flush();

// Stop the reaction
reaction.stop();
console.log('Reaction stopped');

// Update counter - reaction does NOT run
counter.set(10);
Reaction.flush();

console.log('Final counter value:', counter.get());
