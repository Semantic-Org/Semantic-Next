import { get, set, trackWrites } from '@semantic-ui/utils';

// Basic usage — sets a nested field from a dot path
const doc = { meta: { count: 0 } };
set(doc, 'meta.count', 5);
console.log(doc);

// Missing intermediates are created, arrays when the segment is an index
console.log(set({}, 'a.b.c', 1));
console.log(set({}, 'items.0.name', 'first'));

// Bracket notation works like get()
console.log(set({}, 'items[1].name', 'second'));

// The write twin of get — sync a change between two objects
const source = { user: { name: 'Alice' } };
const replica = { user: { name: 'Alice' } };
const { paths } = trackWrites(source, (value) => {
  value.user.name = 'Alicia';
});
paths.forEach((path) => set(replica, path, get(source, path)));
console.log(replica);
