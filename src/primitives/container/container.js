import { defineComponent } from '@semantic-ui/component';

import css from './container-bundle.css?raw';
import template from './container.html?raw';
import componentSpec from './specs/container.component.js';

// no functionality
const createComponent = ({ $ }) => ({});

const UIContainer = defineComponent({
  tagName: 'ui-container',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIContainer };
