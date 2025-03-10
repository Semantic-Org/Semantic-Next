import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');

const defaultState = {
  currentTime: new Date()
};

const createComponent = ({ state }) => ({
  initialize() {
    setInterval(() => state.currentTime.now(), 1000);
  },
});

defineComponent({
  tagName: 'current-time',
  defaultState,
  template,
  createComponent,
});
