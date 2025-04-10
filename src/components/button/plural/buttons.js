import { defineComponent } from '@semantic-ui/component';
import componentSpec from '../spec/buttons-component.json';

import pageCSS from '../button-page.css?raw';
import css from '../button-bundle.css?raw';

import template from './buttons.html?raw';

export const UIButtons = defineComponent({
  tagName: 'ui-buttons',
  plural: true,
  singularTag: 'ui-button',
  delegateFocus: true,
  componentSpec,
  template,
  css,
  pageCSS,
});
