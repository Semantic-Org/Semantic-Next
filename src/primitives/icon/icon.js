import { defineComponent } from '@semantic-ui/component';

import css from './icon-bundle.css?raw';
import template from './icon.html?raw';
import componentSpec from './specs/icon.component.js';

// nothing yet
const createComponent = ({ self, $ }) => ({});

const UIIcon = defineComponent({
  tagName: 'ui-icon',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIIcon };
