import { groupBy } from '@semantic-ui/utils';

const people = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 30 },
];
const grouped = groupBy(people, 'age');
console.log(grouped);
