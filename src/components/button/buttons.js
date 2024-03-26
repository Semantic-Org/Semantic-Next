import { createComponent } from '@semantic-ui/component';

import ButtonShadowCSS from './css/button-shadow.css?raw';
import ButtonLightCSS from './css/button-light.css?raw';
import ButtonsTemplate from './buttons.html?raw';
import { ButtonSpec } from './spec/spec.js';

export const UIButtons = createComponent({
  tagName: 'ui-buttons',
  plural: true,
  singularTag: 'ui-button',
  spec: ButtonSpec,
  template: ButtonsTemplate,
  css: ButtonShadowCSS,
  lightCSS: ButtonLightCSS,
});
