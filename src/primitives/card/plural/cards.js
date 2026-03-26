import { defineComponent } from '@semantic-ui/component';

import css from '../card-bundle.css?raw';
import componentSpec from '../specs/cards.component.js';
import template from './cards.html?raw';

export const Cards = defineComponent({
  tagName: 'ui-cards',
  singularTag: 'ui-card',
  plural: true,
  delegateFocus: true,
  componentSpec,
  template,
  css,
});
