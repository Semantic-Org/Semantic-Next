import { defineComponent, getText } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultSettings = {
  proofPoints: [
    `Customizing your theme with <code class="font-mono font-medium text-gray-950 dark:text-white">@theme</code>`,
    `Adding custom utilities with <code class="font-mono font-medium text-gray-950 dark:text-white">@utility</code>`,
    `Adding custom variants with <code class="font-mono font-medium text-gray-950 dark:text-white">@variant</code>`,
    `Code completion with instant preview`,
  ],
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
