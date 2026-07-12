import { flush, reaction, reactiveObject } from '@semantic-ui/reactivity';

const form = reactiveObject({ name: 'Ada', email: 'ada@x.io' });

// depend() subscribes to ONE path without reading it — the work reads elsewhere
reaction(() => {
  form.depend('name');
  console.log('name changed, revalidating');
});

form.set('name', 'Grace');
flush();

form.set('email', 'grace@x.io'); // disjoint path, the reaction stays quiet
flush();
