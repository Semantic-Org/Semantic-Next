# Semantic Tailwind Plugin

This is the official plugin for using Tailwind classes inside Semantic UI components.


### Examples

```javascript
import { TailwindPlugin as tailwind } from '@semantic-ui/tailwind';

const myComponent = {
  name: 'my-button',
  template: `<button class="px-4 py-2 bg-purple-600 text-white rounded-lg">Click Me</button>`
};

// tailwind classes will be inserted into shadow dom of component
defineComponent( await tailwind(myComponent) );
```

## License

[ISC](LICENSE)
