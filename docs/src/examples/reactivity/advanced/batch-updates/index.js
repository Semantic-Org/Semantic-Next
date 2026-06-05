// Batch Updates: Understanding automatic batching behavior
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const firstName = signal('John');
const lastName = signal('Doe');

// Reaction that depends on both signals
reaction(() => {
  console.log('Full name:', `${firstName.get()} ${lastName.get()}`);
});

console.log('--- Multiple synchronous updates ---');
// These updates are automatically batched
firstName.set('Jane');
lastName.set('Smith');
// Only one reaction will run with the final values

console.log('--- After automatic batching ---');
flush(); // Force immediate execution to see result

console.log('--- Manual flush between updates ---');
firstName.set('Bob');
flush(); // Force execution after first change

lastName.set('Johnson');
flush(); // Force execution after second change
