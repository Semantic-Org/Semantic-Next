import { defineComponent, getText } from '@semantic-ui/component';

// subtemplates are exported explicitly
import { row } from './row.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  title: 'Table',
  company: 'Metatron Industries',
};

const createComponent = ({ settings }) => ({
  rows: [
    ['Jane', 'Fonda', '55', 'Female'],
    ['Matt', 'Stone', '23', 'Male'],
    ['Tory', 'Mcguiness', '25', 'Female'],
  ]
});

defineComponent({
  tagName: 'ui-table',
  template,
  css,
  defaultSettings,
  createComponent,
  // subtemplates are passed in explicitly
  subTemplates: {
    row
  }
});
