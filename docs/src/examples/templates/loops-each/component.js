import { defineComponent, getText } from '@semantic-ui/component';
import { range } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  numbers: range(1, 6),
  getFirst: 'First',
  getSecond: 'Second',
  people: [
    { name: 'John', age: 32 },
    { name: 'Jane', age: 28 },
    { name: 'Bob', age: 35 },
  ],
};

defineComponent({
  tagName: 'each-basic',
  template,
  css,
  defaultState,
});
