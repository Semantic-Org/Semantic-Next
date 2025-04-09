import { defineComponent } from '@semantic-ui/component';
import { CardComponentSpec } from '@semantic-ui/specs';

import Template from './card.html?raw';
import CSS from './card-bundle.css?raw';
import pageCSS from './card-page.css?raw';

const createComponent = ({ $ }) => ({});

const UICard = defineComponent({
  tagName: 'ui-card',
  componentSpec: CardComponentSpec,
  template: Template,
  css: CSS,
  pageCSS,
  createComponent,
});

export { UICard };
