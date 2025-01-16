import { defineComponent } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';

const settings = {
  value: 1,
  date: new Date(),
  timezone: 'PST'
};

const createComponent = ({ settings }) => ({
  //initialize: () => setInterval(() => settings.date = new Date(), 1000),
  addOne(value, value2 = 0) {
    return value + value2 + 1;
  },
  getValue(obj, prop) {
    return obj[prop];
  }
});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  settings,
  createComponent
});
