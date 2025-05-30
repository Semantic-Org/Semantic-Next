import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  counter: 0,
  isActive: false,
};

const defaultSettings = {
  username: 'Guest User',
  role: 'Visitor',
  isAdmin: false,
  avatar: '/images/avatar/matthew.png',
};

const createComponent = ({ self, settings, state }) => ({
  activate() {
    state.isActive.set(true);
  },

  deactivate() {
    state.isActive.set(false);
  },

  incrementLoginCount() {
    state.counter.increment();
  },
});

const events = {
  'click .card'({ self }) {
    self.activate();
    self.incrementLoginCount();
  },
};

defineComponent({
  tagName: 'ui-profile',
  template,
  css,
  defaultState,
  defaultSettings,
  createComponent,
  events,
});
