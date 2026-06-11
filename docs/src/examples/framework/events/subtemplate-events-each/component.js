import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const counter = defineComponent({
  template: await getText('./counter.html'),
  defaultState: {
    clicks: 0,
  },
  events: {
    'click ui-button'({ state }) {
      state.clicks.increment();
    },
  },
});

defineComponent({
  tagName: 'counter-list',
  template,
  css,
  subTemplates: { counter },
  defaultState: {
    items: [
      { id: 1, label: 'one' },
      { id: 2, label: 'two' },
      { id: 3, label: 'three' },
    ],
  },
});
