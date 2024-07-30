import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const template = await getText('./component.html');

const state = {
  currentTime: new Date()
};

const createInstance = ({tpl, state}) => ({
  initialize() {
    setInterval(() => state.currentTime.now(), 1000);
  },
});

createComponent({
  tagName: 'current-time',
  state,
  template,
  createInstance,
});
