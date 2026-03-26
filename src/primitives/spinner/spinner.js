import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/spinner.component.js';
import css from './spinner-bundle.css?raw';
import template from './spinner.html?raw';

const createComponent = ({ $ }) => ({});

const Spinner = defineComponent({
  tagName: 'ui-spinner',
  componentSpec,
  template,
  css,
  createComponent,
});

export { Spinner };
