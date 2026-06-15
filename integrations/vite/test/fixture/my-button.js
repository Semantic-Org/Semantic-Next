import { defineComponent } from '@semantic-ui/component';

import css from './my-button.css?raw';
import template from './my-button.html?raw';

export const MyButton = defineComponent({
  tagName: 'my-button',
  template,
  css,
});
