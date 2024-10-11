import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  startingNumber: 0
};

const createComponent = ({ self, reactiveVar, settings }) => ({
  counter: reactiveVar(),
  initialize() {
    self.counter.set(settings.startingNumber);
  },
  isEven: (number) => (number % 2 == 0)
});

const onCreated = ({ self }) => {
  setInterval(() => self.counter.increment(), 1000);
};

defineComponent({
  tagName: 'ui-counter',
  template,
  css,
  createComponent,
  settings,
  onCreated,
});
