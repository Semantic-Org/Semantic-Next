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

console.log('--- Async Set iteration ---');
const mySet = new Set(['apple', 'banana', 'cherry']);
await asyncEach(mySet, async (value, index) => {
  await delay(50);
  console.log(`Set item ${index}: ${value}`);
});

console.log('--- Async Map iteration ---');
const myMap = new Map([
  ['name', 'John'],
  ['age', 30],
  ['city', 'New York']
]);
await asyncEach(myMap, async (value, key) => {
  await delay(75);
  console.log(`${key}: ${value}`);
});

console.log('--- Breaking async Set iteration ---');
const numberSet = new Set([10, 20, 30, 40, 50]);
await asyncEach(numberSet, async (value) => {
  await delay(25);
  console.log(`Set value: ${value}`);
  if (value === 30) {
    return false; // breaks the loop
  }
});
