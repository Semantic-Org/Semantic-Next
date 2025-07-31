import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/icon-component.json' with { type: 'json' };
import template from './icon.html?raw';
import css from './icon-bundle.css?raw';

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
