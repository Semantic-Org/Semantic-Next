import { defineComponent } from '@semantic-ui/component';

import componentSpec from './spec/icon-component.json' assert { type: 'json' };
import css from './icon-bundle.css?raw';
import template from './icon.html?raw';

// nothing yet
const createComponent = ({ self, $ }) => ({});

const UIIcon = defineComponent({
  tagName: 'ui-icon',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIIcon };
