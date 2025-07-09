import { where } from '@semantic-ui/utils';

const people = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 30 },
];
const result = where(people, { age: 30 });
console.log(result);
