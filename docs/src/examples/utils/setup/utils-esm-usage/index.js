import { unique } from '@semantic-ui/utils';

const numbers = [1, 2, 2, 3, 3, 4];
const uniqueNumbers = unique(numbers);

console.log('Original:', numbers);
console.log('Unique:', uniqueNumbers);
