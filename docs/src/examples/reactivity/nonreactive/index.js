import { Signal, Reaction } from '@semantic-ui/reactivity';

const nameSignal = new Signal('Alice');
const statusSignal = new Signal('Online');

console.log('--- Initial State ---');
console.log(`Name: ${nameSignal.peek()}, Status: ${statusSignal.peek()}`);
console.log('--- Creating Reaction ---');

// This reaction depends on nameSignal but NOT statusSignal
Reaction.create(() => {
  // Dependency created on nameSignal
  const name = nameSignal.get();

  // Read statusSignal's value WITHOUT creating a dependency
  const status = Reaction.nonreactive(() => statusSignal.get());

  console.log(`Reaction Run: ${name} is currently ${status}`);
});

console.log('--- Updating Name (should trigger reaction) ---');
nameSignal.set('Bob');

// Force flush to see immediate effect in console if needed,
// though often not required for simple examples.
// Reaction.flush();

console.log('--- Updating Status (should NOT trigger reaction) ---');
statusSignal.set('Offline');

console.log('--- Final State ---');
console.log(`Name: ${nameSignal.peek()}, Status: ${statusSignal.peek()}`);
