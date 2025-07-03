// First Run: Detecting initial reaction execution
import { Reaction, Signal } from '@semantic-ui/reactivity';

const message = new Signal('Hello');

// Reaction that behaves differently on first run
Reaction.create((reaction) => {
  const text = message.get();

  if (reaction.firstRun) {
    console.log('Initial setup:', text);
  }
  else {
    console.log('Update:', text);
  }
});

// Update message - not first run anymore
message.set('World');
Reaction.flush();

message.set('Universe');
Reaction.flush();
