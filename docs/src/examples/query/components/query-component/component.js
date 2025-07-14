import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  count: 0,
};

const createComponent = ({ state }) => ({
  increment() {
    state.count.increment();
  },
  reset() {
    state.count.set(0);
  },
});

defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  defaultState,
  createComponent,
});