import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/rail-component.js';
import template from './rail.html?raw';
import css from './rail-bundle.css?raw';

const createComponent = ({ $ }) => ({});

const UIRail = defineComponent({
  tagName: 'ui-rail',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIRail };
