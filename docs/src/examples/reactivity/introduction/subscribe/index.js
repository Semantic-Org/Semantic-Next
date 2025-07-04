import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create a signal
const message = new Signal('Hello');

// Subscribe returns a reaction that can be stopped
const subscription = message.subscribe((value) => {
  console.log('Message:', value);
});

// Update the signal
message.set('World');
Reaction.flush();

// Stop the subscription
subscription.stop();

// This won't trigger the subscription
message.set('Goodbye');
Reaction.flush();
