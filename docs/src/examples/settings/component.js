import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  startingNumber: 0
};

const createInstance = ({tpl, reactiveVar, settings}) => ({
  counter: reactiveVar(),
  initialize() {
    tpl.counter.set(settings.startingNumber);
  },
  isEven: (number) => (number % 2 == 0)
});

const onCreated = ({tpl}) => {
  setInterval(() => tpl.counter.increment(), 1000);
};

createComponent({
  tagName: 'ui-counter',
  template,
  css,
  createInstance,
  settings,
  onCreated,
});
