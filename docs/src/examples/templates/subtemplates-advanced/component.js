import { defineComponent, getText } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  // this will be overridden with the row to render at runtime
  rowTemplate: new Template(),
  headers: [],
  rows: [],
};

defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  defaultSettings,
});
