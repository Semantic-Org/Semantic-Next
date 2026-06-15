# @semantic-ui/astro

Use Semantic UI components in Astro. They render on the server, so the page arrives fully styled with no flash before they upgrade. Mark a component with a `client:*` directive to make it interactive, and it upgrades itself in the browser. You write no hydration code.

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
