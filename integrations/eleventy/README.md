# @semantic-ui/eleventy

Eleventy plugin that server-renders Semantic UI components in your built HTML to Declarative Shadow DOM. Static pages ship pre-rendered, styled shadow content that self-hydrates when the component JavaScript loads.

Requires Eleventy 3 (ESM config).

## Install

```bash
npm install @semantic-ui/eleventy
```

## Use

```js
// eleventy.config.js
import semanticUI from '@semantic-ui/eleventy';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(semanticUI, {
    components: ['@semantic-ui/core/button', '@semantic-ui/core/icon'],
  });
}
```

Write Semantic UI tags directly in your templates:

```html
<ui-button emphasis="primary">Get started</ui-button>
```

The plugin expands every registered tag into DSD at build time. Load the component runtime on the page to make them interactive:

```html
<script type="module" src="/semantic-ui.js"></script>
```

## Options

- `components` — module specifiers to import for their component registrations. A tag is only expanded once its component has been imported, so list every component your pages use. Unlisted tags pass through untouched.
- `hydrate` — default `true`. Pass `false` to emit static markup that is never claimed by the runtime.
