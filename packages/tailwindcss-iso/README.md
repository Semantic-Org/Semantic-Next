# Isomorphic Tailwind Compiler

This library is designed to let you programatically generate tailwinds css from a string of content, designed for server-side (Node.js) and client-side (browser) environments.

This package uses the official Tailwind CSS engine, including a custom single-threaded WASM build of the Oxide scanner for safe and efficient use in the browser. It is useful for generating tailwinds programatically in a build step in a uniform way on the client and server.


> This is being used as part of primary tooling for tailwind support inside web components for [@semantic-org/semantic-next](https://github.com/Semantic-Org/Semantic-Next). You can see it in action in this [Tailwinds example](https://next.semantic-ui.com/examples/tailwind).

## Key Features
* **Extract Classes**: Extract candidate tailwind classes from string
* **Generate CSS from String**: Generate tailwind css from strings of html and js
* **Isomorphic**: Works seamlessly in Node.js and modern browsers.
* **WASM-Powered**: Uses a WebAssembly-based scanner in the browser for high performance without dependencies.
* **Zero Production Dependencies**: Clean and lightweight for your projects.
* **Component Plugin Included**: Also includes a plugin for easy integration with a component definition structure.

## Examples

### Generating CSS

```javascript
import { generateTailwindCSS } from 'tailwindcss-iso';

const css = '
  @theme {
    /* This changes the bluish grays to a monochrome color */
    --color-gray-100: theme(colors.zinc.100);
    --color-gray-300: theme(colors.zinc.300);
    --color-gray-700: theme(colors.zinc.700);
    --color-gray-950: theme(colors.zinc.950);
  }
'

const content = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const tailwindCSS = await generateTailwindCSS({ content, css });

// The `tailwindCSS` variable now contains the generated Tailwind styles.
// You can inject this into a <style> tag or save it to a file.
console.log(tailwindCSS);
```


### Getting Candidate Class Names

Note: the official terminology is "candidate classes" as these may include false positives. This are filtered when compiling the tailwind css with `generateTailwindCSS`.

#### As Array
```javascript
import { getTailwindClasses } from 'tailwindcss-iso';

const content = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const classes = await getTailwindClasses({ content });

// an array of classes as strings
console.log(classes);
```

#### As Array With Position

```javascript
import { getTailwindClasses } from 'tailwindcss-iso';

const content = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const classes = await getTailwindClasses({ content, returnPosition: true });

// an array of objects with position in content
console.log(classes);
```

## License

[ISC](LICENSE)
