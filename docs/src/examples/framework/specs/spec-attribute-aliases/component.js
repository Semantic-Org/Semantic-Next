import { defineComponent, getText } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';
import markerSpec from './marker.spec.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const reader = new SpecReader(markerSpec);
const componentSpec = reader.getWebComponentSpec();

// componentSpec.optionAttributes is the generated table of accepted spellings
defineComponent({
  tagName: 'ui-marker',
  componentSpec,
  template,
  css,
});
