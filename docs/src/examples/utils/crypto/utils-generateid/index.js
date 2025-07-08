import { generateID } from '@semantic-ui/utils';

console.log(generateID());
console.log(generateID());
console.log(generateID());

// with custom seed for reproducible IDs
console.log(generateID(12345));
console.log(generateID(12345));
