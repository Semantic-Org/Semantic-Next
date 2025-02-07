import { Signal, Reaction } from '@semantic-ui/reactivity';

const lastUpdated = new Signal(new Date());

Reaction.create((reaction) => {
  console.clear();
  console.log(`Last updated: ${lastUpdated.get().toLocaleTimeString()}`);
});

// Update log every second
setInterval(() => lastUpdated.now(), 1000);
