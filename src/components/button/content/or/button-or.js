import { defineComponent } from '@semantic-ui/component';

import OrCSS from './button-or.css?raw';
import OrTemplate from './button-or.html?raw';

export const ButtonOr = defineComponent({
  tagName: 'button-or',
  template: OrTemplate,
  css: OrCSS,
});
