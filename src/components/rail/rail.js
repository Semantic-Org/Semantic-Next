import { defineComponent } from '@semantic-ui/component';

import componentSpec from './spec/rail-component.json' assert { type: 'json' };
import template from './rail.html?raw' assert { type: 'txt' };
import css from './rail-bundle.css?raw' assert { type: 'css' };

const createComponent = ({ $ }) => ({});

const UIRail = defineComponent({
  tagName: 'ui-rail',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIRail };
