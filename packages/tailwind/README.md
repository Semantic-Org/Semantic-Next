# Isomorphic Tailwind Compiler

A lightweight, isomorphic utility to compile Tailwind CSS from a string of content, designed for server-side (Node.js) and client-side (browser) environments.

This package uses the official Tailwind CSS engine, including a custom single-threaded WASM build of the Oxide scanner for safe and efficient use in the browser. It is the perfect solution for dynamic applications, component libraries, or any scenario where you need to generate Tailwind styles on-the-fly without relying on the DOM or a traditional build step.

While created for a ground-up rewrite of Semantic UI, this package is a powerful, standalone tool for any developer needing to compile Tailwind CSS programmatically.

## Key Features

* **Compile from String**: Core functionality to generate CSS from a string of HTML or JavaScript content.
* **Isomorphic**: Works seamlessly in Node.js and modern browsers.
* **WASM-Powered**: Uses a WebAssembly-based scanner in the browser for high performance without dependencies.
* **Zero Production Dependencies**: Clean and lightweight for your projects.
* **Component Plugin Included**: Also includes a plugin for easy integration with a component definition structure.

## Primary Usage: Compile CSS from a String

This is the most common use case. The `generateTailwindCSS` function takes your content and returns the compiled CSS.

```javascript
import { generateTailwindCSS } from '@semantic-ui/tailwind';

const myHtmlContent = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const css = await generateTailwindCSS({ content: myHtmlContent });

// The `css` variable now contains the generated Tailwind styles.
// You can inject this into a <style> tag or save it to a file.
console.log(css);
```

## Secondary Usage: Component Plugin

The package also includes a plugin for use with a structured component definition.

```javascript
import { TailwindPlugin } from '@semantic-ui/tailwind';

const myComponent = {
  name: 'my-button',
  template: `<button class="px-4 py-2 bg-purple-600 text-white rounded-lg">Click Me</button>`
};

const tailwind = TailwindPlugin();
const processedComponent = await tailwind(myComponent);

// Now `processedComponent.css` contains the generated Tailwind CSS for the component.
console.log(processedComponent.css);
```

## License

[ISC](LICENSE)
