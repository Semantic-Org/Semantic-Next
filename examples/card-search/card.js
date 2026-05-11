import { defineComponent } from '@semantic-ui/component';

import css from './card.css?raw';
import template from './card.html?raw';
export const card = defineComponent({
  renderingEngine: 'native',
  template,
  css,
});
