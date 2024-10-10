import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./row.css');
const template = await getText('./row.html');

const createInstance = ({ findParent }) => ({
  getTitle() {
    return findParent('ui-table').getTitle();
  }
});

export const row = defineComponent({
  createInstance,
  template,
  css,
});
