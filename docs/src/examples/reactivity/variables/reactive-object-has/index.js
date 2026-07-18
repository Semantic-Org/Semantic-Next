import { flush, reaction, reactiveObject } from '@semantic-ui/reactivity';

const form = reactiveObject({ email: 'a@b.c' });

reaction(() => console.log('has email:', form.has('email')));

form.set('email', undefined); // still present, a stored undefined is not absent
flush();

form.remove('email'); // now the key is gone
flush();
