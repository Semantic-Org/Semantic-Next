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

// a [#id] segment selects an array element by identity, not position
const doc = {
  members: [
    { id: 'jack@semantic-ui.com', role: 'owner' },
    { id: '200.40.50', role: 'editor' },
  ],
};
console.log(get(doc, 'members[#jack@semantic-ui.com].role'));

// the id can be any string without ']' — dots inside a bracket belong to the id
console.log(get(doc, 'members[#200.40.50].role'));
