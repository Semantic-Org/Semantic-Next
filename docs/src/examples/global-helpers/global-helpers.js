import { defineComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const template = await getText('./component.html');

const state = {
  currentTime: new Date()
};

const createInstance = ({ state }) => ({
  initialize() {
    setInterval(() => state.currentTime.now(), 1000);
  },
});

defineComponent({
  tagName: 'current-time',
  state,
  template,
  createInstance,
});
