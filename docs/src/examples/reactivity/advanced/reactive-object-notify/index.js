import { flush, reaction, reactiveObject } from '@semantic-ui/reactivity';

const doc = reactiveObject({ user: { name: 'Ann', age: 30 } });

reaction(() => console.log('name:', doc.get('user.name')));
reaction(() => console.log('age:', doc.get('user.age')));

// mutate the stored object in place — set() can't see this, the reference is unchanged
doc.raw('user').name = 'Bea';

// notify() force-wakes the path and every descendant, even the unchanged age reader
doc.notify('user');
flush();
