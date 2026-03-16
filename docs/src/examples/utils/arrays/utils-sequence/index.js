import { sequence } from '@semantic-ui/utils';

// basic sequence: 1 through 5
console.log(sequence(5));

// multiples of 3
console.log(sequence(3, 3));

// multiples of 10
console.log(sequence(5, 10));

// custom start offset: (2+i)*3 for i=0..4
console.log(sequence(5, 3, 2));

// zero-based: useful for angle steps, pixel offsets, etc.
console.log(sequence(4, 90, 0));
