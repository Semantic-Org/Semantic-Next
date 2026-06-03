import { getSource, reaction, setStackCapture, signal } from '@semantic-ui/reactivity';

// stack capture records where each reactive change originates
setStackCapture(true);

const score = signal(0);

reaction(() => {
  score.get();
  getSource(); // logs a grouped trace of what triggered this run
});

score.set(10); // re-runs the reaction, getSource traces the change
