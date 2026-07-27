import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

// same definition on both sides, the browser needs it loaded to hydrate
export const Card = defineComponent({
  tagName: 'ssr-card',
  template,
  css,

  defaultSettings: {
    label: '',
  },

  defaultState: {
    count: 0,
  },

  events: {
    'click .count'({ state }) {
      state.count.increment();
    },
  },
});
