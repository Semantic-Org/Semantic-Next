import { detectChanges, get, set, unset } from '@semantic-ui/utils';

// Basic usage — removes a nested field from a dot path
const doc = { meta: { temp: true, count: 1 } };
unset(doc, 'meta.temp');
console.log(doc);

// Missing paths are a no-op
console.log(unset({ a: 1 }, 'x.y.z'));

// Removed array indices leave a hole so sibling paths stay valid
const list = { items: ['a', 'b', 'c'] };
unset(list, 'items.1');
console.log(list.items[2]);

// Applies a full detectChanges diff together with set
const before = { name: 'a', temp: true };
const after = { name: 'b', nickname: 'al' };
const diff = detectChanges(before, after);
const replica = { ...before };
[...diff.added, ...diff.changed].forEach((path) => set(replica, path, get(after, path)));
diff.removed.forEach((path) => unset(replica, path));
console.log(replica);
