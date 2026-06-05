// Performance: Optimizing reactive computations
import { afterFlush, flush, reaction, signal } from '@semantic-ui/reactivity';

const data = signal([1, 2, 3, 4, 5]);
const triggerUpdate = signal(false);

// Expensive computation that we want to optimize
function expensiveCalculation(arr) {
  console.log('Running expensive calculation...');
  return arr.reduce((sum, num) => sum + num * num, 0);
}

// Unoptimized: runs expensive calculation every time
reaction(() => {
  if (triggerUpdate.get()) {
    const result = expensiveCalculation(data.peek()); // Use peek to avoid dependency
    console.log('Unoptimized result:', result);
  }
});

// Optimized: use afterFlush to batch expensive operations
let needsRecalc = false;
reaction(() => {
  if (triggerUpdate.get()) {
    needsRecalc = true;
    afterFlush(() => {
      if (needsRecalc) {
        const result = expensiveCalculation(data.peek());
        console.log('Optimized result:', result);
        needsRecalc = false;
      }
    });
  }
});

// Trigger the calculations
triggerUpdate.set(true);
flush();
