import { debounce } from '@semantic-ui/utils';

// Sync function example
function logMessage(message) {
  console.log(`Sync: ${message} at ${Date.now()}`);
  return `logged: ${message}`;
}

// Async function example
async function saveData(data) {
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log(`Async: saved ${data}`);
  return `saved: ${data}`;
}

// Basic debouncing - only last call executes
console.log('Basic debouncing:');
const debouncedLog = debounce(logMessage, 100);
debouncedLog('call 1');
debouncedLog('call 2'); 
debouncedLog('call 3'); // Only this executes

// Async debouncing with promise sharing
console.log('\nAsync debouncing (promise sharing):');
const debouncedSave = debounce(saveData, 100);
Promise.all([
  debouncedSave('data1'),
  debouncedSave('data2'),  
  debouncedSave('data3') // Only this executes, all promises resolve to same result
]).then(results => {
  console.log('All results:', results); // All get 'saved: data3'
});

// Leading execution
setTimeout(() => {
  console.log('\nLeading execution:');
  const leadingDebounce = debounce(logMessage, 200, { leading: true });
  console.log('Immediate result:', leadingDebounce('immediate')); // Executes right away
  leadingDebounce('ignored'); // Debounced
}, 300);

// MaxWait option
setTimeout(() => {
  console.log('\nMaxWait forces execution:');
  const maxWaitDebounce = debounce(logMessage, 50, { maxWait: 120 });
  maxWaitDebounce('call1');
  setTimeout(() => maxWaitDebounce('call2'), 30);
  setTimeout(() => maxWaitDebounce('call3'), 60); // Forces execution at 120ms
}, 600);