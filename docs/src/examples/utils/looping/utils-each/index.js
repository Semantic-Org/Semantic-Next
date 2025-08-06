import { each } from '@semantic-ui/utils';

const arr = [1, 2, 3];
each(arr, (value, index) => {
  console.log(`Index ${index}: ${value}`);
});

const obj = { a: 1, b: 2, c: 3 };
each(obj, (value, key) => {
  console.log(`${key}: ${value}`);
});

const numbers = [1, 2, 3, 4, 5];
each(numbers, (value) => {
  console.log(`Processing: ${value}`);
  if (value === 3) {
    return false; // breaks the loop
  }
});

console.log('--- Set iteration ---');
const mySet = new Set(['apple', 'banana', 'cherry']);
each(mySet, (value, index) => {
  console.log(`Set item ${index}: ${value}`);
});

console.log('--- Map iteration ---');
const myMap = new Map([
  ['name', 'John'],
  ['age', 30],
  ['city', 'New York']
]);
each(myMap, (value, key) => {
  console.log(`${key}: ${value}`);
});

console.log('--- Breaking Set iteration ---');
const numberSet = new Set([10, 20, 30, 40, 50]);
each(numberSet, (value, index) => {
  console.log(`Set value: ${value}`);
  if (value === 30) {
    return false; // breaks the loop
  }
});
