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
