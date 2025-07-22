import { idleCallback } from '@semantic-ui/utils';

console.log('Starting idle callback demo...');

// Execute non-critical tasks when browser is idle
idleCallback(() => {
  console.log('Task 1: Running during idle time');
});

idleCallback(() => {
  console.log('Task 2: Preloading data');
});

idleCallback(() => {
  console.log('Task 3: Cleanup operations');
});

console.log('All idle callbacks scheduled');
