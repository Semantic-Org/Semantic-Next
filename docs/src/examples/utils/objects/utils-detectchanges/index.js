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
