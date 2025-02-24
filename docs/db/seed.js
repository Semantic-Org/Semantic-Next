import { db, Playgrounds, Files } from 'astro:db';
import { generateID } from '@semantic-ui/utils'

export default async function () {

  // clear data
  await db.delete(Files);
  await db.delete(Playgrounds);

  // Seed some initial playgrounds
  const result = await db.insert(Playgrounds).values([
    {
      exampleId: generateID(),
      title: 'Playground 1',
      userId: 'user123',
      version: 1
    },
    {
      exampleId: generateID(),
      title: 'Playground 2',
      userId: 'user123',
      version: 1
    },
    {
      exampleId: generateID(),
      title: 'Playground 3',
      userId: 'user345',
      version: 1
    }
  ]).returning({ id: Playgrounds.id });

  const ids = result.map(val => val.id);


  const componentText = `import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'current-time',
  template: \`Time is <b>{formatDate time "h:mm:ss a"}</b>\`,
  css: 'b { color: var(--primary-text-color); }',
  defaultState: { time: new Date() },
  onCreated({state}) {
    setInterval(() => state.time.now(), 1000);
  }
});`;

  const counterJS = `import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  counter: 0
};

const createComponent = ({ state }) => ({
  initialize: () => setInterval(() => state.counter.increment(), 1000),
  isEven: (number) => (number % 2 == 0)
});

defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  defaultState,
  createComponent
});`;

  const counterHTML = `<div class="counter">
  <div class="parity">
    {#if isEven counter}
     Even
    {else}
     Odd
    {/if}
  </div>
  <span class="text">
    The counter is {counter}
  </span>
</div>`;

  await db.insert(Files).values([
    // user 1 minimal
    { playgroundId: ids[0], filename: 'component.js', content: componentText },
    // user 1 counter
    { playgroundId: ids[1], filename: 'component.js', content: counterJS },
    { playgroundId: ids[1], filename: 'component.html', content: counterHTML },
    // user 2 counter
    { playgroundId: ids[2], filename: 'component.js', content: counterJS },
    { playgroundId: ids[2], filename: 'component.html', content: counterHTML },
  ]);
}
