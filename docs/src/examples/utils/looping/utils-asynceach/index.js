import { asyncEach } from '@semantic-ui/utils';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // simulate async work

const arr = [1, 2, 3];
await asyncEach(arr, async (value, index) => {
  await delay(100);
  console.log(`Index ${index}: ${value}`);
});

const obj = { a: 1, b: 2 };
await asyncEach(obj, async (value, key) => {
  await delay(50);
  console.log(`${key}: ${value}`);
});

const numbers = [1, 2, 3, 4, 5];
await asyncEach(numbers, async (value) => {
  console.log(`Processing: ${value}`);
  if (value === 3) {
    return false; // breaks the loop
  }
});
