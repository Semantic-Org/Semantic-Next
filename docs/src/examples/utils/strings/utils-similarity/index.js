import { similarity } from '@semantic-ui/utils';

// How alike two strings read, 0 to 1
console.log(similarity('kitten', 'sitting'));
console.log(similarity('hello', 'hello'));
console.log(similarity('abc', 'xyz'));

// Case-insensitive
console.log(similarity('JavaScript', 'javascript', { ignoreCase: true }));

// Typo tolerance with swaps
console.log(similarity('recieve', 'receive', { swaps: true }));

// Early-exit floor for fuzzy filtering
const names = ['Grace Hopper', 'Grace Hooper', 'Ada Lovelace'];
console.log(names.filter((name) => similarity('Grace Hopper', name, { min: 0.8 }) >= 0.8));
