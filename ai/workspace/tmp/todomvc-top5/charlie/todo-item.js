import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./todo-item.html');

export const todoItem = defineComponent({
  template,
});
