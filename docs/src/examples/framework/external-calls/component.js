import { defineComponent, getText } from '@semantic-ui/component';
const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  startingNumber: 0,
};

const defaultState = {
  counter: 0,
  running: true,
};

const createComponent = ({ self, state, settings, interval }) => ({
  initialize() {
    self.setCounter(settings.startingNumber);
    self.startCounter();
  },
  setCounter(number) {
    state.counter.set(number);
  },
  startCounter() {
    state.running.set(true);
    self.interval = interval(() => state.counter.increment(), 1000);
  },
  stopCounter() {
    state.running.set(false);
    clearInterval(self.interval);
  },
});

defineComponent({
  tagName: 'ui-counter',
  createComponent,
  css,
  template,
  defaultState,
  defaultSettings,
});
