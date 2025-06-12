import { defineComponent, getText } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

const template = await getText('./component.html');
const css = await getText('./component.css');

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
const transform = TailwindPlugin();
definition = await transform(definition);

export const TailwindDemo = defineComponent(definition);
