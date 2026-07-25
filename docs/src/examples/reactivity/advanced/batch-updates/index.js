import { flush, reaction, signal } from '@semantic-ui/reactivity';

const width = signal(1024);
const height = signal(768);

reaction(() => {
  console.log('Viewport:', `${width.get()} x ${height.get()}`);
});

console.log('--- Two writes in one tick ---');
width.set(1280);
height.set(720);

// one run, with both final values
flush();

console.log('--- A flush between the writes ---');
width.set(800);
flush();

height.set(600);
flush();
