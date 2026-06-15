# @semantic-ui/vite

Vite plugin for Semantic UI. Author your components, point the plugin at them, and every registered tag in your HTML is server-rendered to Declarative Shadow DOM at build time, so it hydrates with no flash of an unupgraded element.

## Install

```bash
npm install @semantic-ui/vite
```

## Use

```js
// vite.config.js
import { defineConfig } from 'vite';
import semanticUI from '@semantic-ui/vite';

export default defineConfig({
  plugins: [
    semanticUI({ components: ['./src/components/index.js'] }),
  ],
});
```

`components` points at the module(s) whose import registers yours (where you call `defineComponent`). Then write your tags directly in HTML:

```html
<my-button>Get started</my-button>
```

and the build expands every registered tag into DSD:

```html
<my-button><template shadowrootmode="open"><style>...</style>...</template>Get started</my-button>
```

A tag whose component isn't registered passes through untouched and self-hydrates on the client. Expansion skips markup that already carries a shadow root, so it's safe to re-run and composes with server-rendered fragments.

First-party components register the same way: `import '@semantic-ui/core/button'` makes `<ui-button>` expandable.

## Authoring

The plugin also adds the `?ast` loader for build-time template precompilation. Vite resolves `?raw` natively. Omit `components` and you get those loaders without the auto-expansion.
