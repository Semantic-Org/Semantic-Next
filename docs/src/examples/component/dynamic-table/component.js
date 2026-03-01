import { defineComponent, getText } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  headers: [],
  rows: [],
  rowTemplate: new Template(),
};

defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  defaultSettings,
});
