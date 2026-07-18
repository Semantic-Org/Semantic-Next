import { flush, reaction, reactiveObject } from '@semantic-ui/reactivity';

const board = reactiveObject({ tags: ['red', 'green'] });

let draft;
reaction(() => {
  draft = board.clone('tags'); // tracked, but detached from the stored array
  console.log('tags:', draft);
});

draft.push('blue'); // mutate the copy freely, the stored value is untouched
console.log('stored:', board.peek('tags')); // still red, green

board.set('tags', ['orange']); // a real write still re-runs the reader
flush();
