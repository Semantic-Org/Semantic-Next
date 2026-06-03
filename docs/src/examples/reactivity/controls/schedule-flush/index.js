// Schedule Flush: Manual flush scheduling
import { flush, reaction, scheduleFlush, signal } from '@semantic-ui/reactivity';

const status = signal('idle');

reaction(() => {
  console.log('Status:', status.get());
});

console.log('--- Update and schedule flush ---');
status.set('loading');

// Schedule a flush to happen (usually automatic)
scheduleFlush();

console.log('--- Before flush completes ---');
console.log('Current status:', status.peek());

// Force immediate flush
console.log('--- Forcing immediate flush ---');
flush();

console.log('--- After flush ---');
