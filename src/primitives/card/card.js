import { defineComponent } from '@semantic-ui/component';

import css from './card-bundle.css?raw';
import pageCSS from './card-page.css?raw';
import template from './card.html?raw';
import componentSpec from './specs/card-component.js';

const createComponent = ({ $ }) => ({});

const UICard = defineComponent({
  tagName: 'ui-card',
  componentSpec,
  template,
  css,
  pageCSS,
  createComponent,
});

export { UICard };
