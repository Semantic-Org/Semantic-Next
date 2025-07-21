import { throttle } from '@semantic-ui/utils';

// Sync function example  
function logEvent(event) {
  console.log(`Sync: ${event} at ${Date.now()}`);
  return `logged: ${event}`;
}

// Async function example
async function apiCall(endpoint) {
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log(`Async: called ${endpoint}`);
  return `response from ${endpoint}`;
}

// Basic throttling - leading and trailing (default)
console.log('Basic throttling (leading + trailing):');
const throttledLog = throttle(logEvent, 200);
console.log('First result:', throttledLog('event1')); // Executes immediately
throttledLog('event2'); // Queued for trailing
throttledLog('event3'); // Replaces event2

// Async throttling
console.log('\nAsync throttling:');
const throttledAPI = throttle(apiCall, 150);
throttledAPI('/users').then(result => console.log('API result:', result));
throttledAPI('/posts'); // Queued for trailing execution

// Leading only - execute immediately, ignore subsequent
setTimeout(() => {
  console.log('\nLeading only:');
  const leadingOnly = throttle(logEvent, 300, { leading: true, trailing: false });
  console.log('Immediate result:', leadingOnly('click1')); // Executes immediately
  leadingOnly('click2'); // Ignored
  leadingOnly('click3'); // Ignored
}, 400);

// Trailing only - execute once after throttle period  
setTimeout(() => {
  console.log('\nTrailing only:');
  const trailingOnly = throttle(logEvent, 200, { leading: false, trailing: true });
  trailingOnly('scroll1'); // Queued
  trailingOnly('scroll2'); // Replaces scroll1
  trailingOnly('scroll3'); // This executes after 200ms
}, 800);

// High frequency events simulation
setTimeout(() => {
  console.log('\nHigh frequency events:');
  const throttledScroll = throttle(logEvent, 100);
  for (let i = 1; i <= 8; i++) {
    setTimeout(() => throttledScroll(`scroll${i}`), i * 20);
  }
  // Only first and last will execute due to throttling
}, 1200);