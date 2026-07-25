import { defineComponent, getText } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';
import chipSpec from './chip.spec.js';

const css = await getText('./component.css');
const template = await getText('./component.html');
const groupTemplate = await getText('./chips.html');

// one spec, read twice
const componentSpec = new SpecReader(chipSpec).getWebComponentSpec();
const groupSpec = new SpecReader(chipSpec, { plural: true }).getWebComponentSpec();

defineComponent({
  tagName: 'ui-chip',
  componentSpec,
  template,
  css,
});

defineComponent({
  tagName: 'ui-chips',
  plural: true,
  componentSpec: groupSpec,
  template: groupTemplate,
  css,
});
