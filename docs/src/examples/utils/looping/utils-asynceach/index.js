import { asyncEach } from '@semantic-ui/utils';

// Simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Async array processing
console.log('Async array processing:');
const urls = ['api/users', 'api/posts', 'api/comments'];

await asyncEach(urls, async (url, index) => {
  console.log(`  Starting request ${index + 1}: ${url}`);
  await delay(100); // Simulate API call
  console.log(`  Completed request ${index + 1}: ${url}`);
});

console.log('All requests completed!');

// Async object processing
console.log('\nAsync object processing:');
const tasks = {
  database: 'Connecting to database',
  cache: 'Warming up cache',
  queue: 'Starting background queue',
};

await asyncEach(tasks, async (description, taskName) => {
  console.log(`  ${taskName}: ${description}...`);
  await delay(150);
  console.log(`  ${taskName}: Complete!`);
});

// Early termination in async context
console.log('\nAsync early termination:');
const numbers = [1, 2, 3, 4, 5];

await asyncEach(numbers, async (num) => {
  console.log(`  Processing: ${num}`);
  await delay(50);
  if (num === 3) {
    console.log('  Found 3, stopping!');
    return false; // breaks the async loop
  }
});

console.log('Async processing with early termination complete!');
