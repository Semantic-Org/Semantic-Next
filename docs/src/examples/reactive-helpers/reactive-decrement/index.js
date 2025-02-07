// Helper: decrement
import { Signal, Reaction } from '@semantic-ui/reactivity';

const score = new Signal(100);

Reaction.create((reaction) => {
  const currentScore = score.get();
  if(!reaction.firstRun) {
    console.log(`Score: ${currentScore}`);
  }
});


score.decrement(); // Decrement by 1
Reaction.flush();
score.decrement(10); // Decrement by 10
