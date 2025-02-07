import { Signal } from '@semantic-ui/reactivity';

const letters = new Signal(['a', 'b', 'c']);

letters.setIndex(1, 'x');
console.log(letters.get()); // Output: ['a', 'x', 'c']
