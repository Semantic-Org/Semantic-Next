import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  firstName: 'Alice',
  lastName: 'Johnson',
  age: 28,
  city: 'Portland',

  items: ['Red', 'Green', 'Blue'],
  numbers: [5, 10, 15],

  user: {
    name: 'Bob',
    role: 'admin',
    active: true,
  },
};

const createComponent = () => ({
  // Helper methods for examples
  concat(...args) {
    return args.join('');
  },

  formatName(first, last) {
    return `${first} ${last}`;
  },

  multiply(a, b) {
    return a * b;
  },

  getRole(user, prefix = '') {
    return `${prefix}${user.role}`;
  },

  joinWith(array, separator) {
    return array.join(separator);
  },
});

export default defineComponent({
  tagName: 'template-expressions-lisp',
  template,
  css,
  defaultState,
  createComponent,
});
