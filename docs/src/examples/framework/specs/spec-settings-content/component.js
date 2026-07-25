import { defineComponent, getText } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';
import statSpec from './stat.spec.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const reader = new SpecReader(statSpec);
const componentSpec = reader.getWebComponentSpec();

// count, unit and label reach the template with no defaultSettings block
defineComponent({
  tagName: 'ui-stat',
  componentSpec,
  template,
  css,
});
