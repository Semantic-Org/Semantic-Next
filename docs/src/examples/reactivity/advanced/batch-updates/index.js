// Batch Updates: Understanding automatic batching behavior
import { Reaction, Signal } from '@semantic-ui/reactivity';

const firstName = new Signal('John');
const lastName = new Signal('Doe');

// Reaction that depends on both signals
Reaction.create(() => {
  console.log('Full name:', `${firstName.get()} ${lastName.get()}`);
});

console.log('--- Multiple synchronous updates ---');
// These updates are automatically batched
firstName.set('Jane');
lastName.set('Smith');
// Only one reaction will run with the final values

console.log('--- After automatic batching ---');
Reaction.flush(); // Force immediate execution to see result

console.log('--- Manual flush between updates ---');
firstName.set('Bob');
Reaction.flush(); // Force execution after first change

lastName.set('Johnson');
Reaction.flush(); // Force execution after second change
