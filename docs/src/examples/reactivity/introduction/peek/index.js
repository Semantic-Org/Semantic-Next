// Peek: Reading signal values without creating dependencies
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create signals
const counter = new Signal(0);
const multiplier = new Signal(2);

// Reaction that only depends on counter, not multiplier
Reaction.create(() => {
  const count = counter.get();
  const multi = multiplier.peek(); // Read without creating dependency
  console.log(`${count} x ${multi} = ${count * multi}`);
});

// Update counter - triggers reaction
counter.set(5);
Reaction.flush();

// Update multiplier - does NOT trigger reaction (we used peek)
multiplier.set(10);
Reaction.flush();
console.log('Multiplier changed but reaction did not run');

// Update counter again - reaction runs with new multiplier value
counter.set(7);
Reaction.flush();
