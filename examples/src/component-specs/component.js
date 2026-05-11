import { defineComponent } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';
import widgetSpec from './button.spec.js';

import css from './component.css?raw';
import template from './component.html?raw';
const reader = new SpecReader(widgetSpec);
const componentSpec = reader.getWebComponentSpec();

export const UIWidget = defineComponent({
  tagName: 'ui-widget',
  componentSpec,
  template,
  css,
});
