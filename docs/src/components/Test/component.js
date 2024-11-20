import { defineComponent, getText } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

import css from './component.css?raw';
import template from './component.html?raw';


const settings = {
  rowTemplate: new Template(), // user can specify a template to render the rows
  headers: [],
  rows: [
    { firstName: 'Buck', lastName: 'Pencilsworth', age: '42', gender: 'Male' },
    { firstName: 'Mildred', lastName: 'Staplegun', age: '67', gender: 'Female' },
    { firstName: 'Chip', lastName: 'Windowsill', age: '23', gender: 'Male' },
    { firstName: 'Peggy', lastName: 'Lunchroom', age: '51', gender: 'Female' },
    { firstName: 'Duke', lastName: 'Coffeebean', age: '38', gender: 'Male' },
    { firstName: 'Dot', lastName: 'Keyboarder', age: '29', gender: 'Female' },
    { firstName: 'Brick', lastName: 'Wallman', age: '45', gender: 'Male' },
    { firstName: 'Betty', lastName: 'Mouseclicks', age: '33', gender: 'Female' },
    { firstName: 'Rod', lastName: 'Sockdrawer', age: '58', gender: 'Male' },
    { firstName: 'Penny', lastName: 'Deskchair', age: '31', gender: 'Female' },
  ],
};

export const DynamicTable = defineComponent({
  tagName: 'dynamic-table',
  template,
  css,
  settings,
});
