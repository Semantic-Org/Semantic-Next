import { defineComponent, getText } from '@semantic-ui/component';

const pageCSS = await getText('./page.css');
const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  counter: 0,
  componentCounter: 0,
};

const events = {
  'click .component'({ state, event }) {
    state.componentCounter.increment();
    event.stopImmediatePropagation(); // lets not make global counter increment
  },
  'global click body'({ state }) {
    state.counter.increment();
  },
};

defineComponent({
  tagName: 'ui-clicker',
  template,
  defaultState,
  events,
  css,
  pageCSS,
});
