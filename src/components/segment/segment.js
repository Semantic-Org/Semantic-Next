import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/segment-component.json' with { type: 'json' };
import template from './segment.html?raw';
import css from './segment-bundle.css?raw';

const createComponent = ({ $ }) => ({});

const UISegment = defineComponent({
  tagName: 'ui-segment',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UISegment };
