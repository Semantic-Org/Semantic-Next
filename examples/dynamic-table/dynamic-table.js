import { defineComponent } from '@semantic-ui/component';

import css from './dynamic-table.css?raw';
import template from './dynamic-table.html?raw';


const defaultSettings = {
  rowTemplate: undefined,
  headers: [],
  rows: [],
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
  defaultSettings,
  createComponent
});
