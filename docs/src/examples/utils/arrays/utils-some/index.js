import { some } from '@semantic-ui/utils';

const numbers = [1, 2, 3, 4, 5];
const result = some(numbers, (num) => num > 3);
console.log(result);
