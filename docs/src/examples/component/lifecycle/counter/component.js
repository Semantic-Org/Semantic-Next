// imports /* playground-fold */

import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');
/* playground-fold-end */


const state = {
  counter: 0
};

const createInstance = ({ state }) => ({
  initialize: () => setInterval(() => state.counter.increment(), 1000),
  isEven: (number) => (number % 2 == 0)
});

// exports /* playground-fold */

createComponent({
  tagName: 'ui-counter',
  template,
  css,
  state,
  createInstance
});
/* playground-fold-end */
