import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  indeterminate: true,
};

const events = {
  'click ui-button'({ state }) {
    state.indeterminate.toggle();
  },
};

defineComponent({
  tagName: 'expressions-properties',
  template,
  css,
  events,
  defaultState,
});
