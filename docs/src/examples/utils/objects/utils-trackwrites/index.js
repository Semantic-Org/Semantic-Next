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

// Keyed paths by default — a field edit across a collection reads back per
// record (todos[#id].complete), not by array index, with zero configuration
const db = { todos: [{ id: 'a', complete: false }, { id: 'b', complete: false }] };
const completeAll = trackWrites(db, (d) => {
  for (const todo of d.todos) { todo.complete = true; }
});
console.log('Keyed:', completeAll.paths);

// A structural op is one keyed element add
const pushed = trackWrites(db, (d) => {
  d.todos.push({ id: 'c', complete: false });
});
console.log('Pushed:', pushed.paths);

// The proxy strategy is the positional opt-out (no element identity)
const positional = trackWrites(db, (d) => {
  d.todos[0].complete = false;
}, { strategy: 'proxy' });
console.log('Positional:', positional.paths);

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
