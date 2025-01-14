import { defineComponent } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';


const settings = {
  value: 0,
  now: new Date(),
  timezone: 'PST'
};

const createComponent = ({self, data, settings}) => ({
  addOne(value, value2 = 0) {
    return value + value2 + 1;
  }
});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  settings,
  createComponent
});
