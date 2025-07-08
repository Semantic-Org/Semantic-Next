import { remove } from '@semantic-ui/utils';

const arr = [1, 2, 3, 4, 5];
console.log('Before:', arr);
remove(arr, 3);
console.log('After removing 3:', arr);

// remove using callback
remove(arr, (value) => value > 4);
console.log('After removing > 4:', arr);
