import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/button-component.json' assert { type: 'json' };
import template from './buttons.html?raw';
import css from '../button-bundle.css?raw';
import pageCSS from '../button-page.css?raw';

export const UIButtons = defineComponent({
  tagName: 'ui-buttons',
  singularTag: 'ui-button',
  plural: true,
  delegateFocus: true,
  componentSpec,
  template,
  css,
  pageCSS,
});
