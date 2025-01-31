import { defineComponent, getText } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  rowTemplate: new Template(), // user can specify a template to render the rows
  headers: [],
  rows: [],
};

defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  defaultSettings,
});
