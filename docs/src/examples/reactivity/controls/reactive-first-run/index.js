import { Reaction, Signal } from '@semantic-ui/reactivity';

const message = new Signal('Never shown');

// Since reactions occur immediately
// You might want to avoid triggering side effects until a value changes
Reaction.create((reaction) => {

  // To permit reactivity the value must be accessed before early exit
  // Otherwise the dependency cannot be determined
  const text = message.get();

  if (!reaction.firstRun) {
    console.log(text);
  }
});

// Update message - not first run anymore
message.set('Hello World');
