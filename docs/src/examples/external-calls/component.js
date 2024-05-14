import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  startingNumber: 0
};

const createInstance = ({tpl, settings}) => ({
  counter: new ReactiveVar(),
  running: new ReactiveVar(false),
  initialize() {
    tpl.setCounter(settings.startingNumber);
    tpl.startCounter();
  },
  setCounter(number) {
    tpl.counter.set(number);
  },
  startCounter() {
    tpl.running.set(true);
    tpl.interval = setInterval(() => tpl.counter.increment(), 1000);
  },
  stopCounter() {
    tpl.running.set(false);
    clearInterval(tpl.interval);
  },
});


createComponent({
  tagName: 'ui-counter',
  template,
  css,
  createInstance,
  settings,
});
