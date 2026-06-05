import { flush, reaction, signal } from '@semantic-ui/reactivity';

const isActive = signal(false);

// Reaction logs when value changes
reaction((computation) => {
  const active = isActive.get();
  if (!computation.firstRun) {
    console.log(active);
  }
});

isActive.toggle();
flush();
isActive.toggle();
