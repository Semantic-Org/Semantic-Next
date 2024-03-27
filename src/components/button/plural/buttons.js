import { createComponent } from '@semantic-ui/component';

import ButtonShadowCSS from '../css/button-shadow.css?raw';
import ButtonLightCSS from '../css/button-light.css?raw';
import { ButtonSpec } from '../spec/spec.js';

import ButtonsTemplate from './buttons.html?raw';

export const UIButtons = createComponent({
  tagName: 'ui-buttons',
  plural: true,
  singularTag: 'ui-button',
  delegateFocus: true,
  spec: ButtonSpec,
  template: ButtonsTemplate,
  css: ButtonShadowCSS,
  lightCSS: ButtonLightCSS,
});
