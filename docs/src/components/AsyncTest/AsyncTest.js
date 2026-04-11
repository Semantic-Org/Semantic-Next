import { defineComponent } from '@semantic-ui/component';

export const AsyncTest = defineComponent({
  tagName: 'async-test',
  renderingEngine: 'native',
  template: `
    <div class="result">
      {#async fetchData as data}
        <p class="resolved">Result: {data}</p>
      {loading}
        <p class="loading">Loading...</p>
      {/async}
    </div>
    <button class="refetch">Refetch</button>
    <div class="log"></div>
  `,
  defaultState: { version: 0 },
  createComponent: ({ self, state, $ }) => ({
    async fetchData(v = state.version.get()) {
      await new Promise(r => setTimeout(r, 500));
      return 'v' + v;
    },
    refetch() {
      state.version.increment();
    },
  }),
  events: {
    'click .refetch'({ self }) {
      self.refetch();
    },
  },
});
