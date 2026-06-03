// Reaction Basics: Creating reactive computations
import { flush, reaction, signal } from '@semantic-ui/reactivity';

// Create signals
const firstName = signal('John');
const lastName = signal('Doe');

// Create a reaction that combines the signals
reaction(() => {
  const full = `${firstName.get()} ${lastName.get()}`;
  console.log('Full name:', full);
});

// Update signals - reaction runs automatically
firstName.set('Jane');
flush();

// Update another signal
lastName.set('Smith');
flush();
