import { reaction, signal } from '@semantic-ui/reactivity';

const message = signal('Never shown');

// Since reactions occur immediately
// You might want to avoid triggering side effects until a value changes
reaction((computation) => {
  // To permit reactivity the value must be accessed before early exit
  // Otherwise the dependency cannot be determined
  const text = message.get();

  if (!computation.firstRun) {
    console.log(text);
  }
});

// Update message - not first run anymore
message.set('Hello World');
