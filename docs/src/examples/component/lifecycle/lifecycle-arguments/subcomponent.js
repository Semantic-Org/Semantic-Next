import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./subcomponent.css');
const template = await getText('./subcomponent.html');

const createInstance = ({ findParent }) => ({
  getTitle() {
    return findParent('ui-table').getTitle();
  }
});

export const tableRow = createComponent({
  createInstance,
  template,
  css,
});
