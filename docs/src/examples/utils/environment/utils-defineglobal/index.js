import { defineGlobal } from '@semantic-ui/utils';

const store = { todos: ['write docs'] };

// a fresh name lands on globalThis, so the console can reach it
console.log(defineGlobal('store', store) === globalThis.store);

// the same value again is quiet, the shape of a module re-run under hot reload
console.log(defineGlobal('store', store) === store);

// a different value keeps what is there and warns once in development
console.log(defineGlobal('store', { todos: [] }) === store);

// keep is get-or-create, the first definition wins without a word
const bus = defineGlobal('eventBus', new EventTarget(), { onConflict: 'keep' });
console.log(defineGlobal('eventBus', new EventTarget(), { onConflict: 'keep' }) === bus);

// replace overwrites, the shape of test setup
console.log(defineGlobal('store', { todos: [] }, { onConflict: 'replace' }) !== store);

// any object can be the host, a library namespace instead of the global
const library = {};
defineGlobal('plugins', [], { host: library });
console.log(library.plugins);
