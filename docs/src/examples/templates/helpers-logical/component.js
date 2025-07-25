import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  // Data for exists helper
  username: 'alice',
  email: null,

  // Data for hasAny helper
  notifications: ['Welcome!', 'New message'],
  emptyList: [],

  // Data for both/either helpers
  isLoggedIn: true,
  isAdmin: false,
  isModerator: true,

  // Data for maybe helper
  status: 'online',
};

defineComponent({
  tagName: 'helpers-logical',
  template,
  css,
  defaultState,
});
