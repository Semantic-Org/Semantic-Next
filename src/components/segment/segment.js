import { defineComponent } from '@semantic-ui/component';

import componentSpec from './spec/segment-component.json' assert { type: 'json' };
import template from './segment.html?raw' assert { type: 'txt' };
import css from './segment-bundle.css?raw' assert { type: 'css' };

const createComponent = ({ $ }) => ({});

const UISegment = defineComponent({
  tagName: 'ui-segment',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UISegment };
