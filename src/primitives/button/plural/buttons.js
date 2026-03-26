import { defineComponent } from '@semantic-ui/component';

import css from '../button-bundle.css?raw';
import componentSpec from '../specs/buttons.component.js';
import template from './buttons.html?raw';

export const UIButtons = defineComponent({
  tagName: 'ui-buttons',
  singularTag: 'ui-button',
  plural: true,
  delegateFocus: true,
  componentSpec,
  template,
  css,
});
