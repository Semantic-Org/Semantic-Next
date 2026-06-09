import { trackWrites } from '@semantic-ui/utils';

// Basic usage — detects in-place changes
const doc = { meta: { count: 0 }, title: 'Notes' };
const { changed } = trackWrites(doc, (value) => {
  value.meta.count++;
});
console.log('Changed:', changed);
console.log('After:', doc);

// Writing a value that is already there is not a change
const settings = { theme: 'dark' };
const noop = trackWrites(settings, (value) => {
  value.theme = 'dark';
});
console.log('No-op changed:', noop.changed);

// The callback's return value passes through as result
const counter = { count: 1 };
const { result } = trackWrites(counter, (value) => value.count * 10);
console.log('Result:', result);

// onWrite reports each write with its key path from the root
const rows = [{ name: 'a', active: false }, { name: 'b', active: false }];
trackWrites(rows, (tracked) => {
  tracked[1].active = true;
}, { onWrite: (path) => console.log('Wrote:', path.join('.')) });

// Large values use a tracked wrapper so cost scales with writes, not size
const records = Array.from({ length: 1000 }, (_, i) => ({ id: i, seen: false }));
const big = trackWrites(records, (tracked) => {
  tracked[500].seen = true;
});
console.log('Big changed:', big.changed);
