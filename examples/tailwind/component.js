import { defineComponent } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

import template from './component.html?raw';
import css from './component.css?raw';
const defaultSettings = {
  proofPoints: [],
};

let definition = {
  tagName: 'tailwind-demo',
  template,
  css,
  defaultSettings,
};

// Transform with Tailwind plugin
definition = await TailwindPlugin(definition);

export const TailwindDemo = defineComponent(definition);
