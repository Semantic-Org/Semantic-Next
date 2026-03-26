import { defineComponent } from '@semantic-ui/component';

import css from './segment-bundle.css?raw';
import template from './segments.html?raw';
import componentSpec from './specs/segments.component.js';

const createComponent = ({ $ }) => ({});

const UISegments = defineComponent({
  tagName: 'ui-segments',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UISegments };
