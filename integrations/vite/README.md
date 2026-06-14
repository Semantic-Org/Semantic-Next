# @semantic-ui/vite

Vite plugin for server-rendering Semantic UI. Configures Vite's SSR pipeline so the framework packages bundle correctly. Use it in any Vite-based SSR setup alongside [`@semantic-ui/server`](../server) for the actual rendering.

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

The plugin adds `@semantic-ui/*` to `ssr.noExternal` so the packages pass through Vite's transform rather than Node's loader. Render components on the server with `@semantic-ui/server`.

## Why it's needed

The core packages ship raw ESM source without a `type: module` field. Left external, Node treats their `.js` files as CommonJS and throws on the ESM syntax. Bundling them through Vite avoids the ambiguity.

## Resolution note

By default `@semantic-ui/core` resolves to its prebuilt bundle. To bundle raw source instead, add `source` to `resolve.conditions` in your Vite config.
