# @semantic-ui/astro

Astro integration for Semantic UI. Configures Vite, registers SSR + hydration entry points, and emits import maps so Semantic UI's web components render at build time and hydrate in the browser.

## Install

```bash
npm install @semantic-ui/astro
```

## Use

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import semanticUI from '@semantic-ui/astro';

export default defineConfig({
  integrations: [semanticUI()],
});
```

## Subpath exports

- `@semantic-ui/astro` — integration factory (`astro.config.mjs`)
- `@semantic-ui/astro/server` — SSR entry (Astro renders web components to HTML)
- `@semantic-ui/astro/client` — hydration entry (browser-side)

## Docs

Full guide: <https://next.semantic-ui.com>.
