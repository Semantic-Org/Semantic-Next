import { defineComponent } from '@semantic-ui/component';

import componentSpec from '../spec/cards-component.json';
import template from './cards.html?raw';
import css from '../card-bundle.css?raw';

export const UICards = defineComponent({
  tagName: 'ui-cards',
  singularTag: 'ui-card',
  plural: true,
  delegateFocus: true,
  componentSpec,
  template,
  css,
});
