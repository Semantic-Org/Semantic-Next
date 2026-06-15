# @semantic-ui/build

Build-tool plugins for Semantic UI, one implementation for every bundler. Built on [unplugin](https://unplugin.unjs.io), so the same loaders run in esbuild, Vite, Rollup, Rolldown, webpack, and rspack.

Most projects use the named per-bundler package instead — `@semantic-ui/esbuild`, `@semantic-ui/vite`, or `@semantic-ui/rollup` — which wrap the matching entry here. Reach for `@semantic-ui/build` directly only for a bundler without a named package.

## Loaders

Two import suffixes used when authoring components:

- `?raw` — the file's text. Templates and styles are authored as `import css from './x.css?raw'`.
- `?ast` — a template compiled to its AST at build time, so the runtime skips compilation. Recommended for long-running servers and static builds where the compile cost is worth paying once. Pass the result to `defineComponent({ ast })` instead of `template`.

## Use

```js
import { semanticUI } from '@semantic-ui/build';

// pick the entry for your bundler
semanticUI.esbuild();
semanticUI.rollup();
semanticUI.vite();
semanticUI.webpack();
semanticUI.rspack();
```

Vite resolves `?raw` natively, so the Vite entry contributes only `?ast`. Every other bundler gets both.
