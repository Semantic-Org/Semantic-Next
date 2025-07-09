import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  name: 'World',
};

const defaultState = {
  count: 0,
};

const createComponent = ({ state, settings }) => ({
  increment() {
    state.count.increment();
  },
  greet() {
    return `Hello, ${settings.name}!`;
  },
});

const events = {
  'click .increment': ({ self }) => self.increment(),
};

defineComponent({
  tagName: 'ui-demo',
  template,
  css,
  defaultSettings,
  defaultState,
  events,
  createComponent,
});