import { findIndex } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4, 5];
const index = findIndex(arr, (value) => value > 3);
console.log(index);
