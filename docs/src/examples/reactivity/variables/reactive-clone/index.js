import { signal } from '@semantic-ui/reactivity';

const referenced = signal(['apple', 'banana']);
const cloned = signal(['apple', 'banana'], { safety: 'clone' });

// mutate the array each signal hands back, in place
referenced.get().push('cherry');
cloned.get().push('cherry');

console.log('Referenced:', referenced.peek()); // cherry leaked in
console.log('Cloned:', cloned.peek()); // clone stayed clean
