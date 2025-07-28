import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  // Simple values
  name: 'Alice',
  age: 28,

  // Nested object
  user: {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
  },

  // Array
  items: ['Apple', 'Banana', 'Cherry'],

  // Boolean
  isActive: true,
};

export default defineComponent({
  tagName: 'template-expressions',
  template,
  css,
  defaultState,
});
