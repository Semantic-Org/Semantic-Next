import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  startingNumber: 0,
  incrementBy: 1
};

const defaultState = {
  counter: 0
};

const createComponent = ({ self, settings, state }) => ({
  initialize() {
    state.counter.set(settings.startingNumber);
    setInterval(() => state.counter.increment(settings.incrementBy), 1000);
  },
  isEven: (number) => (number % 2 == 0)
});

defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  createComponent,
  defaultSettings,
  defaultState,
});
