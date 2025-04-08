import { defineComponent } from '@semantic-ui/component';
import { CardPluralComponentSpec } from '@semantic-ui/specs';

import CardShadowCSS from '../card-bundle.css?raw';

import CardsTemplate from './cards.html?raw';

export const UICards = defineComponent({
  tagName: 'ui-cards',
  singularTag: 'ui-card',
  plural: true,
  delegateFocus: true,
  componentSpec: CardPluralComponentSpec,
  template: CardsTemplate,
  css: CardShadowCSS,
});
