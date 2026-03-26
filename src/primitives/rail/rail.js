import { defineComponent } from '@semantic-ui/component';

import css from './rail-bundle.css?raw';
import template from './rail.html?raw';
import componentSpec from './specs/rail.component.js';

const createComponent = ({ $ }) => ({});

const UIRail = defineComponent({
  tagName: 'ui-rail',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIRail };
