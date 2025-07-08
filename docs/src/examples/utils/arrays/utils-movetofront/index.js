import { moveToFront } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4];
console.log('Before:', [...arr]);
console.log('After:', moveToFront(arr, 3));
