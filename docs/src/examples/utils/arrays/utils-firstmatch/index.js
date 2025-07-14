import { firstMatch } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4, 5];
const result = firstMatch(arr, (value) => value > 3);
console.log(result);
