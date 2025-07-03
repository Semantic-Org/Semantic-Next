// Schedule Flush: Manual flush scheduling
import { Reaction, Signal } from '@semantic-ui/reactivity';

const status = new Signal('idle');

Reaction.create(() => {
  console.log('Status:', status.get());
});

console.log('--- Update and schedule flush ---');
status.set('loading');

// Schedule a flush to happen (usually automatic)
Reaction.scheduleFlush();

console.log('--- Before flush completes ---');
console.log('Current status:', status.peek());

// Force immediate flush
console.log('--- Forcing immediate flush ---');
Reaction.flush();

console.log('--- After flush ---');
