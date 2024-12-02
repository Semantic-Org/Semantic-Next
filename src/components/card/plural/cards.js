import { defineComponent } from '@semantic-ui/component';
import { CardComponentSpec } from '@semantic-ui/specs';

import CardShadowCSS from '../css/card-shadow.css?raw';

import CardsTemplate from './cards.html?raw';

console.log(CardComponentSpec);

export const UICards = defineComponent({
  tagName: 'ui-cards',
  singularTag: 'ui-card',
  plural: true,
  delegateFocus: true,
  componentSpec: CardComponentSpec,
  template: CardsTemplate,
  css: CardShadowCSS,
});
