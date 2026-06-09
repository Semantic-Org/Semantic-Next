import { get, trackWrites } from '@semantic-ui/utils';

// Basic usage — detects in-place changes and reports the changed paths
const doc = { meta: { count: 0 }, title: 'Notes' };
const { changed, paths } = trackWrites(doc, (value) => {
  value.meta.count++;
});
console.log('Changed:', changed);
console.log('Paths:', paths);

// Paths resolve through get(), e.g. for state sync
console.log('Values:', paths.map((path) => get(doc, path)));

// Writing a value that is already there is not a change
const settings = { theme: 'dark' };
const noop = trackWrites(settings, (value) => {
  value.theme = 'dark';
});
console.log('No-op:', noop.changed, noop.paths);

// The callback's return value passes through as result
const counter = { count: 1 };
const { result } = trackWrites(counter, (value) => value.count * 10);
console.log('Result:', result);

// Skip path collection on hot paths that only read changed
const fast = trackWrites(doc, (value) => {
  value.title = 'Updated';
}, { returnPaths: false });
console.log('Fast:', fast.changed, fast.paths);

// Large values use a tracked wrapper so cost scales with writes, not size
const records = Array.from({ length: 1000 }, (_, i) => ({ id: i, seen: false }));
const big = trackWrites(records, (tracked) => {
  tracked[500].seen = true;
});
console.log('Big:', big.paths);
