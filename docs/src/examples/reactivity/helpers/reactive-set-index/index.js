import { signal } from '@semantic-ui/reactivity';

const letters = signal(['a', 'b', 'c']);

letters.setIndex(1, 'x');
console.log(letters.get()); // Output: ['a', 'x', 'c']
