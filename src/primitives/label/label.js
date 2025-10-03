import { defineComponent } from '@semantic-ui/component';

import css from './label-bundle.css?raw';
import template from './label.html?raw';
import componentSpec from './specs/label-component.js';

const createComponent = ({ $ }) => ({});

const UILabel = defineComponent({
  tagName: 'ui-label',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UILabel };
