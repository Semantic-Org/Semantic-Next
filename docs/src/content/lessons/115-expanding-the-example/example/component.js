import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const state = {
  time: new Date(), // the time to display
};

const createComponent = ({ state }) => ({
  initialize() {
    setInterval(() => state.time.now(), 1000);
  },
});


defineComponent({
  tagName: 'current-time',
  state,
  template,
  createComponent,
  css,
});
