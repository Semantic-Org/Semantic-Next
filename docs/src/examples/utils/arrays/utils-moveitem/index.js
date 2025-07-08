import { moveItem } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4];
console.log('Original:', [...arr]);
console.log(moveItem(arr, 3, 0));
console.log(moveItem(arr, 2, 'last'));

// using callback
console.log(moveItem(arr, x => x === 4, 'first'));
console.log(moveItem(arr, 2, 1));
