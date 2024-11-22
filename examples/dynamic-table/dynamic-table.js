import { defineComponent } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

import css from './dynamic-table.css?raw';
import template from './dynamic-table.html?raw';


const settings = {
  rowTemplate: new Template(), // user can specify a template to render the rows
  headers: [],
  rows: [],
};

const createComponent = ({self, state, settings}) => ({
  getData() {
    console.log('setting data in row');
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
