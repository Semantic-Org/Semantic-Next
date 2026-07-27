import { any, some } from '@semantic-ui/utils';

const numbers = [1, 2, 3, 4, 5];

console.log(some(numbers, (num) => num > 3));

// any is the same function under a second name
console.log(any(numbers, (num) => num > 3));
