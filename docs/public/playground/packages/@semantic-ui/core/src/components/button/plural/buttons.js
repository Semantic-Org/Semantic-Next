import { createComponent } from '@semantic-ui/component';
import { ButtonComponentSpec } from '@semantic-ui/specs';

import ButtonShadowCSS from '../css/button-shadow.css?raw';
import ButtonLightCSS from '../css/button-light.css?raw';

import ButtonsTemplate from './buttons.html?raw';

export const UIButtons = createComponent({
  tagName: 'ui-buttons',
  plural: true,
  singularTag: 'ui-button',
  delegateFocus: true,
  componentSpec: ButtonComponentSpec,
  template: ButtonsTemplate,
  css: ButtonShadowCSS,
  lightCSS: ButtonLightCSS,
});
