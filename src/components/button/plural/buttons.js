import { defineComponent } from '@semantic-ui/component';
import { ButtonComponentSpec } from '@semantic-ui/specs';

import ButtonShadowCSS from '../css/button-shadow.css?raw';
import ButtonPageCSS from '../css/button-page.css?raw';

import ButtonsTemplate from './buttons.html?raw';

export const UIButtons = defineComponent({
  tagName: 'ui-buttons',
  plural: true,
  singularTag: 'ui-button',
  delegateFocus: true,
  componentSpec: ButtonComponentSpec,
  template: ButtonsTemplate,
  css: ButtonShadowCSS,
  pageCSS: ButtonPageCSS,
});
