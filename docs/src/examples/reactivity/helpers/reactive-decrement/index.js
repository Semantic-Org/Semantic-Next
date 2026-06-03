// Helper: decrement
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const score = signal(100);

reaction((computation) => {
  const currentScore = score.get();
  if (!computation.firstRun) {
    console.log(`Score: ${currentScore}`);
  }
});

score.decrement(); // Decrement by 1
flush();
score.decrement(10); // Decrement by 10
