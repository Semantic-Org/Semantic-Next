import { reaction, signal } from '@semantic-ui/reactivity';

const lastUpdated = signal(new Date());

reaction((computation) => {
  console.clear();
  console.log(`Last updated: ${lastUpdated.get().toLocaleTimeString()}`);
});

// Update log every second
setInterval(() => lastUpdated.now(), 1000);
