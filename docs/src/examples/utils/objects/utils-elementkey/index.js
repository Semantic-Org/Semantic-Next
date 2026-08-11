import { detectChanges, elementKey, get, set, unset } from '@semantic-ui/utils';

// Basic usage — the value of the first present identity field, first wins
console.log(elementKey({ id: 'a', _id: 'x' }));
console.log(elementKey({ _id: 'b' }));

// Undefined for a scalar or an object carrying no identity field
console.log(elementKey('plain'));
console.log(elementKey({ name: 'n' }));

// Custom field list — match your own identity field
console.log(elementKey({ sku: 's1' }, ['sku']));

// detectChanges diffs arrays of keyed objects by identity by default, not by
// index. A prepend plus an edit is one add and one field change, never a
// positional cascade ({ keyed: false } restores the index walk)
const before = { lineItems: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] };
const after = { lineItems: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] };
console.log(detectChanges(before, after));

// The emitted field[#id] paths apply back by identity, surviving a reorder.
// The replica holds the same elements shuffled, the delta still lands
const diff = detectChanges(before, after);
const replica = { lineItems: [{ id: 'b', qty: 1 }, { id: 'a', qty: 1 }] };
[...diff.added, ...diff.changed].forEach((path) => set(replica, path, get(after, path)));
diff.removed.forEach((path) => unset(replica, path));
console.log(replica);

// get/set/unset speak the same grammar — [#id] selects by identity, [0] by position
const doc = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
console.log(get(doc, 'items[#b].n'));
set(doc, 'items[#c]', { id: 'c', n: 3 });
unset(doc, 'items[#a]');
console.log(doc.items);
