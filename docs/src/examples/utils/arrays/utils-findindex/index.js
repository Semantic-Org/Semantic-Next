import { findIndex } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4, 5];

// With a callback
console.log(findIndex(arr, (value) => value > 3));

// With a value
console.log(findIndex(arr, 3));
