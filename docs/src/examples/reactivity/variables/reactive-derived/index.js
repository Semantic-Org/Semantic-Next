// Derive: Transform a single signal into a new signal
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create a signal with an array
const numbers = new Signal([1, 2, 3, 4, 5]);

// Derive the array length
const count = numbers.derive(arr => arr.length);

// Reaction to observe the count
Reaction.create(() => {
  console.log('Count:', count.get());
});

// Add a number - derived signal updates automatically
numbers.push(6);
Reaction.flush();

// Remove numbers - count updates again
numbers.splice(0, 2);
Reaction.flush();