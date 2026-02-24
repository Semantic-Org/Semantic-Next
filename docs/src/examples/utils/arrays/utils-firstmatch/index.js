import { firstMatch } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4, 5];

// With a callback
console.log(firstMatch(arr, (value) => value > 3));

// With a value
console.log(firstMatch(arr, 3));
