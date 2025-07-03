// Reaction Basics: Creating reactive computations
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create signals
const firstName = new Signal('John');
const lastName = new Signal('Doe');

// Create a reaction that combines the signals
Reaction.create(() => {
  const full = `${firstName.get()} ${lastName.get()}`;
  console.log('Full name:', full);
});

// Update signals - reaction runs automatically
firstName.set('Jane');
Reaction.flush();

// Update another signal
lastName.set('Smith');
Reaction.flush();
