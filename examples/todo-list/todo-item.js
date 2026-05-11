import { defineComponent } from '@semantic-ui/component';

import template from './todo-item.html?raw';
export const todoItem = defineComponent({
  renderingEngine: 'native',
  template,
});
