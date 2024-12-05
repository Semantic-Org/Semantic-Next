import { defineComponent } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

import css from './component.css?raw';
import template from './component.html?raw';


const settings = {
  rowTemplate: new Template(), // user can specify a template to render the rows
  headers: [
    'Name',
    'Age',
    'Gender',
  ],
  rows: [
    { firstName: 'Buck', lastName: 'Pencilsworth', age: '42', gender: 'Male' },
  ],
};

const createComponent = ({self, state, settings}) => ({
  getData() {
    return { firstName: 'Buck', lastName: 'Pencilsworth', age: '42', gender: 'Male' };
  },
});

export const DynamicTable = defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  settings,
  createComponent
});
