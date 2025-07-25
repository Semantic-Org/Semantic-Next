import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  // Data for examples
  firstName: 'Alice',
  lastName: 'Johnson',
  age: 25,
  yearsOfExperience: 3,

  items: ['Apple', 'Banana', 'Cherry', 'Blueberry'],
  scores: [85, 92, 78],
  prices: [12.99, 8.50, 15.75],

  user: {
    name: 'Bob',
    active: true,
    level: 'premium',
  },
};

export default defineComponent({
  tagName: 'template-expressions-mixed',
  template,
  css,
  defaultState,

  createComponent({ state }) {
    return {
      // Simple helper methods for examples
      getMax(arr) {
        return Math.max(...arr);
      },

      concat(...args) {
        return args.join('');
      },

      getStatus(user) {
        return user.active ? 'Active' : 'Inactive';
      },
    };
  },
});
