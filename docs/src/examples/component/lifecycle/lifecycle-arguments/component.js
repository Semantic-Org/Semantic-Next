import { createComponent, getText } from '@semantic-ui/component';

import { tableRow } from './subcomponent.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  title: 'Table',
};

const createInstance = ({ settings }) => ({
  rows: [
    ['Jane', 'Fonda', '55', 'Female'],
    ['Matt', 'Stone', '23', 'Male'],
    ['Tory', 'Mcguiness', '25', 'Female'],
  ],
  getTitle() {
    return settings.title;
  }
});

createComponent({
  tagName: 'ui-table',
  template,
  css,
  settings,
  createInstance,
  subTemplates: {
    row: tableRow
  }
});
