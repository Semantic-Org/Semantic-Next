// Helper: now
import { Signal, Reaction } from '@semantic-ui/reactivity';

const lastUpdated = new Signal(new Date());

Reaction.create((reaction) => {
  const timestamp = lastUpdated.get();
  if(!reaction.firstRun) {
    console.log(`Last updated: ${timestamp.toLocaleTimeString()}`);
  }
});

// Update timestamp after some action
setTimeout(() => {
  lastUpdated.now();
  Reaction.flush();
  // Output: Last updated: [current time]
}, 1000);
