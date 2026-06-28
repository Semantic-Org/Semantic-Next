import { get, trackReads } from '@semantic-ui/utils';

// Basic usage — reports the value paths a callback read
const state = { user: { name: 'Alice', age: 30 }, theme: 'dark' };
const { reads } = trackReads(state, (value) => `${value.user.name} (${value.theme})`);
console.log('Reads:', reads);

// Read paths resolve through get(), e.g. to build a memoization key
console.log('Values:', reads.map((path) => get(state, path)));

// The hard case — reading an array's length, iterating, or spreading depends on
// its STRUCTURE (growth/shrink), which is reported apart from element values
const db = { todos: [{ id: 'a', done: false }, { id: 'b', done: true }] };
const computed = trackReads(db, (value) => value.todos.map((todo) => todo.done));
console.log('Element reads:', computed.reads);
console.log('Structure:', computed.structure);

// Keyed paths by default — element reads id-address (todos[#id]), so a read
// dependency matches a write to the same record and survives a reorder
console.log('Survives reorder:', computed.reads.map((path) => get(db, path)));

// keyed: false uses positional paths instead
const positional = trackReads(db, (value) => value.todos.map((todo) => todo.done), {
  keyed: false,
});
console.log('Positional:', positional.reads);

// Object.keys / for...in read the key set — a structural dependency
const config = { config: { host: 'localhost', port: 8080 } };
const keysRead = trackReads(config, (value) => Object.keys(value.config));
console.log('Key-set reads:', keysRead.reads, 'structure:', keysRead.structure);

// `in` records the property as a dependency (its existence is a value)
const roles = { roles: { admin: true } };
const inRead = trackReads(roles, (value) => 'admin' in value.roles);
console.log('Existence:', inRead.reads);

// Reading a method is not a dependency; the reads it performs are
const sum = trackReads(db, (value) => value.todos.reduce((n, todo) => n + (todo.done ? 1 : 0), 0));
console.log('Method reads:', sum.reads, 'result:', sum.result);

// An exotic (Date/Map/Set) is a single read, no recursion into internals
const exotic = { when: new Date(2020, 0, 1) };
const exoticRead = trackReads(exotic, (value) => value.when.getFullYear());
console.log('Exotic:', exoticRead.reads);

// onRead streams each read live with its type, for dependency collectors
trackReads(state, (value) => value.user.name, {
  onRead: (path, type) => console.log('Stream:', type, path),
});

// The tracked wrapper is read-only — a write throws (the input is never mutated)
try {
  trackReads(state, (value) => {
    value.theme = 'light';
  });
}
catch (error) {
  console.log('Read-only:', error.message);
}
