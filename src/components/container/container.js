import { defineComponent } from '@semantic-ui/component';
import { ContainerComponentSpec } from '@semantic-ui/specs';

import CSS from './css/container-shadow.css?raw';
import Template from './container.html?raw';

const createComponent = ({$}) => ({
});


const UIContainer = defineComponent({
  tagName: 'ui-container',
  componentSpec: ContainerComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
});

export { UIContainer };
