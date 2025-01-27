import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./row.css');
const template = await getText('./row.html');

const createComponent = ({ findParent }) => ({
  getTitle() {
    return findParent('ui-table').getTitle();
  }
});

// if no tagName is provided a template will be returned for export
export const row = defineComponent({
  createComponent,
  template,
  css,
});
