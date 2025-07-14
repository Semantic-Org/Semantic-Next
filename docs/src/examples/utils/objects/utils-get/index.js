import { get } from '@semantic-ui/utils';

const obj = {
  a: {
    b: {
      c: 42,
    },
  },
  users: [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ],
};

console.log(get(obj, 'a.b.c'));
console.log(get(obj, 'a.b.d'));

// array access
console.log(get(obj, 'users[0].name'));
console.log(get(obj, 'users[1].age'));
