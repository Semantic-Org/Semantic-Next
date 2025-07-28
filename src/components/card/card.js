import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/card-component.json' with { type: 'json' };
import template from './card.html?raw';
import css from './card-bundle.css?raw';
import pageCSS from './card-page.css?raw';

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
