import { defineComponent, getText } from '@semantic-ui/component';

export const RowTemplate = defineComponent({
  template: await getText('./row.html'),
});
