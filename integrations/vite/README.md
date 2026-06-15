# @semantic-ui/vite

Vite plugin for Semantic UI. Adds the `?ast` loader for build-time template compilation (Vite resolves `?raw` natively) and configures Vite's SSR pipeline so the framework packages bundle correctly. Pair it with [`@semantic-ui/server`](../server) for the rendering.

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
  plugins: [semanticUI()],
});
```

This sets `ssr.noExternal` for `@semantic-ui/*` so the packages pass through Vite's transform, and adds the `?ast` loader for precompiled templates:

```js
import ast from './component.html?ast';
defineComponent({ tagName: 'my-widget', ast, css });
```

## Why noExternal is needed

The core packages ship raw ESM source without a `type: module` field. Left external, Node treats their `.js` files as CommonJS and throws on the ESM syntax. Bundling them through Vite avoids the ambiguity.

## Resolution note

By default `@semantic-ui/core` resolves to its prebuilt bundle. To bundle raw source instead, add `source` to `resolve.conditions` in your Vite config.
