import { defineComponent } from '@semantic-ui/component';
import { CardComponentSpec } from '@semantic-ui/specs';

import CSS from './css/card-shadow.css?raw';
import Template from './card.html?raw';

const createComponent = ({$}) => ({
});

const UICard = defineComponent({
  tagName: 'ui-card',
  componentSpec: CardComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
});

export { UICard };
