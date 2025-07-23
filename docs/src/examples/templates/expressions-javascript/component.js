import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  firstName: 'Alice',
  lastName: 'Smith',
  age: 32,
  city: 'Seattle',

  numbers: [10, 25, 5, 30],
  items: ['Red', 'Green', 'Blue', 'Yellow'],

  user: {
    name: 'Bob',
    role: 'manager',
    active: true,
  },

  scores: [88, 92, 76, 85],
};

export default defineComponent({
  tagName: 'template-expressions-javascript',
  template,
  css,
  defaultState,

  createComponent() {
    return {
      formatFullName(first, last) {
        return `${first} ${last}`;
      },

      calculateAverage(numbers) {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
      },

      getTopScore(scores) {
        return Math.max(...scores);
      },

      buildProfile(user, city) {
        return `${user.name} (${user.role}) from ${city}`;
      },
    };
  },
});
