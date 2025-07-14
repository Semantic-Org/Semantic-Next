// Computed: Combine multiple signals into a computed value
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create separate signals
const firstName = new Signal('John');
const lastName = new Signal('Doe');

// Compute full name from multiple signals
const fullName = Signal.computed(() => 
  `${firstName.get()} ${lastName.get()}`
);

// Reaction to observe the computed value
Reaction.create(() => {
  console.log('Full name:', fullName.get());
});

// Change first name - computed updates automatically
firstName.set('Jane');
Reaction.flush();

// Change last name - computed updates again
lastName.set('Smith');
Reaction.flush();