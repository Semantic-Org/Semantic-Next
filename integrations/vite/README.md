# @semantic-ui/vite

Vite plugin for Semantic UI. Write your components, drop in the plugin, and any registered tag in your HTML is server-rendered to Declarative Shadow DOM at build time, so it hydrates with no flash of an unupgraded element.

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

`components` points at the module(s) whose import registers your components (where you call `defineComponent`). Then write your own tags directly in HTML:

```html
<my-button>Get started</my-button>
```

and the build expands every registered tag into DSD:

```html
<my-button><template shadowrootmode="open"><style>...</style>...</template>Get started</my-button>
```

First-party components register the same way: `import '@semantic-ui/core/button'` makes `<ui-button>` expandable.

## What it does

- **Auto-expands** the registered tags in your HTML to DSD. The plugin runs your components through one Vite SSR pass so their `?raw`/`?ast` imports resolve and the same registry feeds the renderer.
- Adds the **`?ast` loader** for build-time template precompilation (Vite resolves `?raw` natively).
- Sets **`ssr.noExternal`** for `@semantic-ui/*` so the framework bundles through Vite.

Tags whose components aren't registered pass through untouched and self-hydrate on the client. Expansion skips markup that already carries a shadow root, so it's safe to re-run and composes with server-rendered fragments. Omit `components` and the plugin is loaders plus SSR config only.
