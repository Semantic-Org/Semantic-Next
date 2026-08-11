import { eachPath } from '@semantic-ui/utils';

// walks every path a path passes through, shortest first
eachPath('todos[#a].done', (path) => console.log(path));

// a bracket splits its segment in two — the array and the element are both levels
eachPath('user.tags[2]', (path) => console.log(path));

// a dot inside a keyed id belongs to the id, never a boundary
eachPath('users[#jack@semantic-ui.com].role', (path) => console.log(path));

// self: false visits only the ancestors above the target
eachPath('todos[#a].done', (ancestor) => console.log(ancestor), { self: false });

// returning false stops the walk, like each
eachPath('a.b.c.d', (path) => {
  console.log(path);
  return path !== 'a.b';
});
