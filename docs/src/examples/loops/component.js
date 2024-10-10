import { defineComponent, getText } from '@semantic-ui/component';
import { range } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const state = {
  numbers: range(1, 6),
  fruits: [
    { taste: 'Good', name: 'Apple' },
    { taste: 'Amazing', name: 'Banana' },
    { taste: 'Good', name: 'Orange' },
    { taste: 'Yummy', name: 'Strawberry' },
    { taste: 'Okay', name: 'Grape' },
    { taste: 'Amazing', name: 'Watermelon' },
    { taste: 'Yummy', name: 'Pineapple' },
    { taste: 'Great', name: 'Mango' },
    { taste: 'Yummy', name: 'Pear' },
    { taste: 'Not for me', name: 'Cherry' },
    { taste: 'Yummy', name: 'Blueberry' },
    { taste: 'Yummy', name: 'Peach' },
    { taste: 'Yummy', name: 'Kiwi' },
    { taste: 'Sometimes', name: 'Plum' },
    { taste: 'Okay', name: 'Raspberry' }
  ],
  person: {
    name: 'John Hellinger',
    age: 32,
    job: 'Hacker',
  },
};

const createInstance = ({ state }) => ({
});

defineComponent({
  tagName: 'ui-list',
  template,
  css,
  state,
  createInstance
});
