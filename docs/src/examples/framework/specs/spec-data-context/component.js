import { defineComponent, getText } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';
import badgeSpec from './badge.spec.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const reader = new SpecReader(badgeSpec);
const componentSpec = reader.getWebComponentSpec();

defineComponent({
  tagName: 'ui-badge',
  componentSpec,
  template,
  css,

  defaultSettings: {
    label: 'Status',
  },

  createComponent: ({ settings }) => ({
    setStatus(newStatus) {
      settings.status = newStatus;
    },

    setSize(newSize) {
      settings.size = newSize;
    },

    setLabel(newLabel) {
      settings.label = newLabel;
    },
  }),
});
