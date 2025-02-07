import { Signal, Reaction } from '@semantic-ui/reactivity';

const isActive = new Signal(false);

// Reaction logs when value changes
Reaction.create((reaction) => {
  const active = isActive.get();
  if(!reaction.firstRun) {
    console.log(active);
  }
});

isActive.toggle();
Reaction.flush();
isActive.toggle();
