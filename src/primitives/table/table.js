import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/table.component.js';
import css from './table-bundle.css?raw';
import template from './table.html?raw';

const createComponent = ({ $ }) => ({});

const UITable = defineComponent({
  tagName: 'ui-table',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UITable };
