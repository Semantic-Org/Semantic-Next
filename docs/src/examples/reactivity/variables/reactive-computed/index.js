// Computed: Combine multiple signals into a computed value
import { computed, flush, reaction, signal } from '@semantic-ui/reactivity';

// Create separate signals
const firstName = signal('John');
const lastName = signal('Doe');

// Compute full name from multiple signals
const fullName = computed(() => `${firstName.get()} ${lastName.get()}`);

// Reaction to observe the computed value
reaction(() => {
  console.log('Full name:', fullName.get());
});

// Change first name - computed updates automatically
firstName.set('Jane');
flush();

// Change last name - computed updates again
lastName.set('Smith');
flush();
