import { createComponent } from '@semantic-ui/component';
import { SegmentComponentSpec } from '@semantic-ui/specs';

import CSS from './css/segment-shadow.css?raw';
import Template from './segment.html?raw';

const createInstance = ({$}) => ({
});


const UISegment = createComponent({
  tagName: 'ui-segment',
  componentSpec: SegmentComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
});

export { UISegment };
