import { deepFreeze } from '@semantic-ui/utils';

const state = deepFreeze({
  user: { name: 'Alice', tags: ['admin', 'editor'] },
  createdAt: new Date(2025, 0, 1),
});

console.log('state is frozen:', Object.isFrozen(state));
console.log('state.user is frozen:', Object.isFrozen(state.user));
console.log('state.user.tags is frozen:', Object.isFrozen(state.user.tags));

// Non-plain objects (Date, Map, Set, RegExp, DOM nodes, class instances)
// are skipped so their internal slots keep working
console.log('state.createdAt is frozen:', Object.isFrozen(state.createdAt));
state.createdAt.setFullYear(2030);
console.log('Date still mutable:', state.createdAt.getFullYear());

// Mutation throws in strict mode
try {
  state.user.name = 'Bob';
}
catch (err) {
  console.log('mutation error:', err.message);
}

// Returns the same reference — not a copy
const obj = { a: 1 };
console.log('deepFreeze(obj) === obj:', deepFreeze(obj) === obj);

// Cycle-safe
const cyclic = { name: 'root' };
cyclic.self = cyclic;
deepFreeze(cyclic);
console.log('cyclic frozen:', Object.isFrozen(cyclic));
