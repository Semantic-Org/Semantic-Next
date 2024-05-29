import { createComponent } from '@semantic-ui/component';
import { RailComponentSpec } from '@semantic-ui/specs';

import CSS from './css/rail-shadow.css?raw';
import Template from './rail.html?raw';

const createInstance = ({$}) => ({
});


const UIRail = createComponent({
  tagName: 'ui-rail',
  componentSpec: RailComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
});

export { UIRail };
