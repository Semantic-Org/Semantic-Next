import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  counter: 0,
};

const createComponent = ({ state, interval }) => ({
  initialize: () => interval(() => state.counter.increment(), 1000),
  isEven: (number) => (number % 2 === 0),
});

export const Counter = defineComponent({
  template,
  css,
  defaultState,
  createComponent,
});
