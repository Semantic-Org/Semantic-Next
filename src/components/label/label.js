import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/label-component.json' with { type: 'json' };
import template from './label.html?raw';
import css from './label-bundle.css?raw';

const createComponent = ({ $ }) => ({});

const UILabel = defineComponent({
  tagName: 'ui-label',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UILabel };
