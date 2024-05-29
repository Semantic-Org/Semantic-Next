import { createComponent } from '@semantic-ui/component';
import { ContainerComponentSpec } from '@semantic-ui/specs';

import CSS from './css/container-shadow.css?raw';
import Template from './container.html?raw';

const createInstance = ({$}) => ({
});


const UIContainer = createComponent({
  tagName: 'ui-container',
  componentSpec: ContainerComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
});

export { UIContainer };
