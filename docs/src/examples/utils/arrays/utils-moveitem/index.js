import { moveItem, moveToBack, moveToFront } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4];
console.log('Original:', [...arr]);

console.log(moveItem(arr, 3, 0));
console.log(moveItem(arr, 2, 'last'));

// a callback picks the item instead of matching its value
console.log(moveItem(arr, x => x === 4, 'first'));

// moveToFront and moveToBack are moveItem with the index fixed
console.log(moveToFront(arr, 3));
console.log(moveToBack(arr, 2));
