import { signal } from '@semantic-ui/reactivity';

const profile = { label: 'draft' };

// reference (the default): stores by reference, the fast path for most signals
const referenced = signal(profile);

// clone: stores and returns copies, guarding state that outside code might mutate
const cloned = signal(profile, { safety: 'clone' });

// none: shares like reference but fires on every set, for event-stream signals
const stream = signal(profile, { safety: 'none' });

// tamper with the original object behind the signals
profile.label = 'edited';

console.log(referenced.get().label); // edited, reference shares the object
console.log(cloned.get().label); // draft, clone kept its own copy
console.log(stream.get().label); // edited, none shares it too
