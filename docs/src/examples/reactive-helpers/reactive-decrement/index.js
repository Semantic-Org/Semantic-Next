// Helper: decrement
import { Signal, Reaction } from '@semantic-ui/reactivity';

const score = new Signal(100);

Reaction.create((reaction) => {
  const currentScore = score.get();
  if(!reaction.firstRun) {
    console.log(`Score: ${currentScore}`);
  }
});

// Decrement by 1
score.decrement();
Reaction.flush();
// Output: Score: 99

// Decrement by custom amount
score.decrement(10);
Reaction.flush();
// Output: Score: 89
