import { range } from '@semantic-ui/utils';

// single argument becomes stop value, start defaults to 0
console.log(range(5));

console.log(range(1, 5));

// with custom step
console.log(range(0, 10, 2));
