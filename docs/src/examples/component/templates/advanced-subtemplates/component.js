import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  rowTemplate: '', // user can specify a template to render the rows
  headers: [],
  rows: [],
};

defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  settings,
});
