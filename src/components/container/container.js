import { defineComponent } from '@semantic-ui/component';

import componentSpec from './spec/container-component.json' assert { type: 'json' };
import template from './container.html?raw';
import css from './container-bundle.css?raw';

// no functionality
const createComponent = ({ $ }) => ({

});

const UIContainer = defineComponent({
  tagName: 'ui-container',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIContainer };
