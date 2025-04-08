import { defineComponent } from '@semantic-ui/component';
import { RailComponentSpec } from '@semantic-ui/specs';

import CSS from './rail-bundle.css?raw';
import Template from './rail.html?raw';

const createComponent = ({ $ }) => ({});

const UIRail = defineComponent({
  tagName: 'ui-rail',
  componentSpec: RailComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
});

export { UIRail };
