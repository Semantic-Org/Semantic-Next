import { reaction, reactiveObject } from '@semantic-ui/reactivity';

// fine-grained over a plain object: each reader subscribes to ONE path
const user = reactiveObject({ name: 'Ada', contact: { email: 'ada@x.io' } });

reaction(() => console.log(`name: ${user.get('name')}`));
reaction(() => console.log(`email: ${user.get('contact.email')}`));

// a write wakes only the reader of that path, the email reader stays quiet
user.set('name', 'Grace');
