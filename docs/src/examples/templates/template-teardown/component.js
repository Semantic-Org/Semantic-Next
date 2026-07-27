import { defineComponent, getText } from '@semantic-ui/component';

import { ticker } from './ticker.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  mounted: true,
  status: 'nothing yet',
};

const createComponent = ({ state }) => ({

  toggle() {
    state.mounted.toggle();
  },

  say(message) {
    state.status.set(message);
  },

});

defineComponent({
  tagName: 'template-teardown',
  template,
  css,
  defaultState,
  createComponent,
  subTemplates: {
    ticker,
  },
});
