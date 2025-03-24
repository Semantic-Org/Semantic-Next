import { defineComponent, getText } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';

const defaultSettings = {
  value: 1,
  date: new Date(),
  timezone: 'PST',
};

const defaultState = {
  fruit: 'cherry',
  isDog: () => true
};

const createComponent = ({ settings }) => ({
  buttonSize: 'large',
  name: 'Alice',
  itemId: 42,
  isSelected: (id) => id === 42,
  numberVal: 10,
  innerFn: (val) => {
    return `Inner(${val})`;
  },
  outerFn: (a, b) => {
    return `Outer(${a}, ${b.foo})`;
  },
  //initialize: () => setInterval(() => settings.date = new Date(), 1000),
  isTrue: () => true,
  addOne(value = 0, value2 = 0) {
    return value + value2 + 1;
  },
  getValue(obj = {}, prop) {
    return obj[prop];
  },
});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
});
