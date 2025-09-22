import { defineComponent, getText } from '@semantic-ui/component';
import './register-helpers.js'; // Register custom helpers

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  price: 29.99,
  userName: 'John Smith',
  createdAt: new Date(Date.now() - 7200000), // 2 hours ago
};

defineComponent({
  tagName: 'helpers-custom',
  template,
  css,
  defaultState,
});
