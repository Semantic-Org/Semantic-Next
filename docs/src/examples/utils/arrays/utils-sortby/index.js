import { sortBy } from '@semantic-ui/utils';

const people = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 },
];

// basic sorting by key
const sorted = sortBy(people, 'age');
console.log(sorted);

// with custom comparator (reverse order)
const sortedDesc = sortBy(people, 'age', (a, b) => b - a);
console.log(sortedDesc);
