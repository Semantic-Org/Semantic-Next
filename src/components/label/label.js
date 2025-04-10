import { defineComponent } from '@semantic-ui/component';

import componentSpec from './spec/label-component.json' assert { type: 'json' };
import template from './label.html?raw' assert { type: 'txt' };
import css from './label-bundle.css?raw' assert { type: 'css' };

const createComponent = ({ $ }) => ({});

const UILabel = defineComponent({
  tagName: 'ui-label',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UILabel };
