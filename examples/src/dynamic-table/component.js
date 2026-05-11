import { defineComponent } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

import css from './component.css?raw';
import template from './component.html?raw';
const defaultSettings = {
  headers: [],
  rows: [],
  rowTemplate: new Template(),
};

export const DynamicTable = defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  defaultSettings,
});
