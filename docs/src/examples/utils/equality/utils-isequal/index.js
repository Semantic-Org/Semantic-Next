import { isEqual } from '@semantic-ui/utils';

console.log(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));
console.log(isEqual([1, 2, 3], [1, 2, 3]));
console.log(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));
console.log(isEqual(NaN, NaN));
console.log(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 }));

// a record and the copy that came back from a save, differing only in bookkeeping
const sent = { title: 'Draft', updatedAt: 1, author: { name: 'Ada', updatedAt: 1 } };
const saved = { title: 'Draft', updatedAt: 2, author: { name: 'Ada', updatedAt: 2 } };

// ignoreKeys drops a key at the top level only, so the nested one still counts
console.log(isEqual(sent, saved, { ignoreKeys: ['updatedAt'] }));

// deepIgnore carries the list into every nested object and array
console.log(isEqual(sent, saved, { ignoreKeys: ['updatedAt'], deepIgnore: true }));

// partial asks whether the first value is contained in the second, at any depth
console.log(isEqual({ author: { name: 'Ada' } }, saved, { partial: true }));

// loose compares leaves with ==, for a number that arrived over the wire as a string
console.log(isEqual({ id: '7' }, { id: 7 }, { loose: true }));
