import { defineComponent } from '@semantic-ui/component';
import { ButtonPluralComponentSpec } from '@semantic-ui/specs';

import ButtonPageCSS from '../button-page.css?raw';
import ButtonCSS from '../button-bundle.css?raw';

import ButtonsTemplate from './buttons.html?raw';

export const UIButtons = defineComponent({
  tagName: 'ui-buttons',
  plural: true,
  singularTag: 'ui-button',
  delegateFocus: true,
  componentSpec: ButtonPluralComponentSpec,
  template: ButtonsTemplate,
  css: ButtonCSS,
  pageCSS: ButtonPageCSS,
});
