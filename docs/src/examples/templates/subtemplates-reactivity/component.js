import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const badge = defineComponent({
  template: '<span class="badge">{count}</span>',
});

const defaultState = {
  cart: 3,
};

const events = {
  'click .add'({ state }) {
    state.cart.increment();
  },
};

defineComponent({
  tagName: 'cart-summary',
  template,
  css,
  defaultState,
  events,
  subTemplates: { badge },
});
