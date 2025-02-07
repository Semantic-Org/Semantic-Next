import { Signal, Reaction } from '@semantic-ui/reactivity';

const isActive = new Signal(false);

// Reaction logs when value changes
Reaction.create((reaction) => {
  const active = isActive.get();
  if(!reaction.firstRun) {
    console.log(active);
  }
});

/* Manual flush prevents multiple updates in same render loop
  from only rendering with final value
*/

isActive.toggle();
Reaction.flush();
// Output: true

isActive.toggle();
Reaction.flush();
// Output: false
