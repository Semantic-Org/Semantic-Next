import { createComponent, getText } from '@semantic-ui/component';
const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  startingNumber: 0
};

const state = {
  counter: 0,
  running: false
};

const createInstance = ({tpl, state, settings}) => ({
  initialize() {
    tpl.setCounter(settings.startingNumber);
    tpl.startCounter();
  },
  setCounter(number) {
    state.counter.set(number);
  },
  startCounter() {
    state.running.set(true);
    tpl.interval = setInterval(() => state.counter.increment(), 1000);
  },
  stopCounter() {
    state.running.set(false);
    clearInterval(tpl.interval);
  },
});


createComponent({
  tagName: 'ui-counter',
  createInstance,
  css,
  template,
  state,
  settings,
});
