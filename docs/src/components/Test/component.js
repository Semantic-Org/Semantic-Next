import { defineComponent, getText } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';

const defaultSettings = {
  value: 'initial',
};

const defaultState = {
};

const createComponent = ({ settings }) => ({

});

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  events: {
    'input input'({settings, value}) {
      settings.value = value;
    },
    'click .set'({settings}) {
      settings.value = 'Dog';
    },
    'click .reset'({settings}) {
      settings.value = '';
    }
  },
  defaultSettings,
  defaultState,
  createComponent,
});
