import { each } from '@semantic-ui/utils';

each([1, 2, 3], (value, index) => {
  console.log(`Index ${index}: ${value}`);
});

each({ a: 1, b: 2, c: 3 }, (value, key) => {
  console.log(`${key}: ${value}`);
});

each([1, 2, 3, 4, 5], (value) => {
  console.log(`Processing: ${value}`);
  if (value === 3) {
    return false; // breaks the loop
  }
});
