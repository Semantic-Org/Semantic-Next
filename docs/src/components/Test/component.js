import { defineComponent } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';


const settings = {
  value: 0
};

const createComponent = ({self, data, settings}) => ({
});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  settings,
  createComponent
});
