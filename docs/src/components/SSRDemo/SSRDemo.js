import { defineComponent } from '@semantic-ui/component';

export const SSRDemo = defineComponent({
  tagName: 'ssr-demo',
  renderingEngine: 'native',
  template: `
    <div class="container">
      <h2>{title}</h2>
      <p>Count: {count}</p>
      {#if showMessage}
        <p class="message">{message}</p>
      {/if}
      <ul>
        {#each item in items}
          <li class="item">{item}</li>
        {/each}
      </ul>
      {#if isClient}
        <p class="client-only">Client-only content (not in server HTML)</p>
      {/if}
      <button class="increment">+1</button>
      <button class="toggle">Toggle message</button>
      <button class="add">Add item</button>
    </div>
  `,
  css: `
    .container { padding: 16px; font-family: sans-serif; color: white; }
    .message { color: #2ecc71; font-weight: bold; }
    .item { padding: 4px 0; }
    button { margin: 4px; padding: 8px 16px; cursor: pointer; }
  `,
  defaultSettings: {
    title: 'SSR Demo',
  },
  defaultState: {
    count: 0,
    showMessage: true,
    message: 'Server-rendered!',
    items: ['Alpha', 'Beta', 'Gamma'],
  },
  onCreated({ state, isClient }) {
    if (isClient) {
      state.items.push('Delta (hydrated)');
    }
  },
  createComponent: ({ state }) => ({
    increment() {
      state.count.increment();
    },
    toggleMessage() {
      state.showMessage.toggle();
    },
    addItem() {
      state.items.push('Item ' + (state.items.get().length + 1));
    },
  }),
  events: {
    'click .increment'({ self }) {
      self.increment();
    },
    'click .toggle'({ self }) {
      self.toggleMessage();
    },
    'click .add'({ self }) {
      self.addItem();
    },
  },
});
