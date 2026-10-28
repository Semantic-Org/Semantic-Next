import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  label: 'Clicks',
};

const defaultState = {
  count: 0,
};

const createComponent = ({ state }) => ({
  increment() {
    state.count.increment();
  },
});

const events = {
  'click .increment'({ self }) {
    self.increment();
  },
};

export const Counter = defineComponent({
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
});
