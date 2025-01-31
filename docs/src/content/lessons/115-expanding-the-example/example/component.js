import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  time: new Date(), // the time to display
};

const createComponent = ({ state }) => ({
  initialize() {
    setInterval(() => state.time.now(), 1000);
  },
});


defineComponent({
  tagName: 'current-time',
  defaultState,
  template,
  createComponent,
  css,
});
