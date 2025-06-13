# Semantic UI Tailwind Plugin

A plugin for integrating Tailwind CSS with Semantic UI components. Automatically scans component definitions for Tailwind classes and generates the corresponding CSS for shadow DOM encapsulation.

## Features

* **Automatic Class Detection**: Scans templates, JavaScript functions, and CSS for Tailwind class usage
* **Shadow DOM Optimized**: Generates scoped CSS that works within web component shadow boundaries  
* **Isomorphic**: Works in both Node.js and browser environments
* **@theme and @utility Support**: Full support for Tailwind's theme customization and custom utilities

## Usage

```javascript
import { defineComponent, getText } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

const template = await getText('./button.html');
const css = await getText('./button.css');

let definition = {
  tagName: 'my-button',
  template,
  css,
  defaultSettings: {
    variant: 'primary'
  }
};

// Transform definition to include generated Tailwind CSS
definition = await TailwindPlugin(definition);

export const MyButton = defineComponent(definition);
```

### Template Example (button.html)
```html
<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
  <slot></slot>
</button>
```

### CSS Example (button.css)
```css
@theme {
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
}

/* Custom utilities */
@utility transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

The plugin will scan all content and generate the appropriate Tailwind CSS, replacing the component's CSS with the compiled output.

## License

[ISC](LICENSE)
