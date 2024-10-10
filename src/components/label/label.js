import { defineComponent } from '@semantic-ui/component';
import { LabelComponentSpec } from '@semantic-ui/specs';

import CSS from './css/label-shadow.css?raw';
import Template from './label.html?raw';

const createComponent = ({$}) => ({
});


const UILabel = defineComponent({
  tagName: 'ui-label',
  componentSpec: LabelComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
});

export { UILabel };
