# @semantic-ui/eleventy

Eleventy plugin that expands the Semantic UI tags in your built HTML into Declarative Shadow DOM at build time. Static pages ship pre-rendered, styled shadow content that self-hydrates when the component JavaScript loads.

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
    components: ['./src/components/index.js'],
  });
}
```

`components` is where you import yours. A tag expands once its component is registered, so list every module your pages pull in. First-party components register the same way:

```js
components: ['@semantic-ui/core/button', '@semantic-ui/core/icon'],
```

Write your tags directly in templates:

```html
<my-button emphasis="primary">Get started</my-button>
```

The plugin expands every registered tag into DSD. Unregistered tags pass through untouched. Load the component runtime to make them interactive:

```html
<script type="module" src="/semantic-ui.js"></script>
```

Components authored with inline template and css strings register on import in Node. If yours use `?raw` template imports, build them through a bundler integration like [`@semantic-ui/vite`](../vite).

## Options

- `components` — module specifiers to import for their registrations
- `hydrate` — default `true`. Pass `false` to emit static markup the runtime never claims
