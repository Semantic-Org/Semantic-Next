import { defineComponent, getText } from '@semantic-ui/component';

const pageCSS = await getText('./page.css');
const template = await getText('./component.html');

const state = {
  text: 'Not Clicked',
  counter: 0,
};

const events = {
  'click'({state}) {
    state.text.set('Clicked');
  },
  'global click body'({state}) {
    state.counter.increment();
  }
};

defineComponent({
  tagName: 'ui-clicker',
  template,
  state,
  events,
  pageCSS
});
