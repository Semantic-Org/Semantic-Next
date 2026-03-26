import { defineComponent } from '@semantic-ui/component';

import css from './segment-bundle.css?raw';
import template from './segment.html?raw';
import componentSpec from './specs/segment.component.js';

const createComponent = ({ $ }) => ({});

const Segment = defineComponent({
  tagName: 'ui-segment',
  componentSpec,
  template,
  css,
  createComponent,
});

export { Segment };
