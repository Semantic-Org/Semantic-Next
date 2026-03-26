import { defineComponent, getText } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';
import widgetSpec from './card.spec.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const reader = new SpecReader(widgetSpec);
const componentSpec = reader.getWebComponentSpec();

defineComponent({
  tagName: 'ui-widget',
  componentSpec,
  template,
  css,
});
