import { detectChanges } from '@semantic-ui/utils';

// Basic usage — added, removed, and changed paths from before to after
const before = { name: 'Alice', temp: true, count: 1 };
const after = { name: 'Alicia', count: 1, nickname: 'Al' };
console.log(detectChanges(before, after));

// Nested objects recurse to leaf paths
const oldDoc = { user: { profile: { name: 'a', age: 30 } } };
const newDoc = { user: { profile: { name: 'b', age: 30 } } };
console.log(detectChanges(oldDoc, newDoc).changed);

// Arrays diff by index
console.log(detectChanges({ items: [1, 2, 3] }, { items: [1, 9] }));

// Deep-equal values with different references are not changes
console.log(detectChanges({ user: { name: 'a' } }, { user: { name: 'a' } }));

// Dates, Maps, and Sets compare by value at their own path
console.log(
  detectChanges(
    { updated: new Date('2020-01-01') },
    { updated: new Date('2030-01-01') },
  ).changed,
);

// Keyed arrays of objects diff by identity — a prepend is one add, not a cascade
console.log(
  detectChanges(
    { items: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] },
    { items: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] },
  ),
);

// equality — a custom comparator decides what counts as changed
console.log(detectChanges({ a: 1 }, { a: '1' }, { equality: (x, y) => x == y }));

// ignoreKeys — drop a volatile or local-only field at any depth
console.log(
  detectChanges(
    { user: { name: 'a', updatedAt: 1 } },
    { user: { name: 'b', updatedAt: 2 } },
    { ignoreKeys: ['updatedAt'] },
  ).changed,
);

// collapseKeys — diff a subtree as one whole value, never descending into it
console.log(
  detectChanges(
    { _overrides: { 'contacts[#1].field': true } },
    { _overrides: { 'contacts[#1].field': false } },
    { collapseKeys: ['_overrides'] },
  ).changed,
);
