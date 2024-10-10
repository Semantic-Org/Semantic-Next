import { defineComponent } from '@semantic-ui/component';
import { LabelComponentSpec } from '@semantic-ui/specs';

import CSS from './css/label-shadow.css?raw';
import Template from './label.html?raw';

const createInstance = ({$}) => ({
});


const UILabel = defineComponent({
  tagName: 'ui-label',
  componentSpec: LabelComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
});

export { UILabel };
