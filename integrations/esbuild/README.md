# @semantic-ui/esbuild

esbuild plugin for authoring Semantic UI components. Adds the `?raw` and `?ast` import suffixes their templates and styles use, which esbuild has no built-in loader for.

## Install

```bash
npm install @semantic-ui/esbuild
```

## Use

```js
import * as esbuild from 'esbuild';
import semanticUI from '@semantic-ui/esbuild';

await esbuild.build({
  entryPoints: ['src/app.js'],
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  plugins: [semanticUI()],
});
```

Import a component's template and css as text:

```js
import template from './component.html?raw';
import css from './component.css?raw';
```

Or precompile the template to its AST at build time, so the runtime skips compilation:

```js
import ast from './component.html?ast';
defineComponent({ tagName: 'my-widget', ast, css });
```

For a browser bundle, set `platform: 'browser'` so `@semantic-ui/*` resolve to their prebuilt browser bundles. For a Node build, esbuild bundles the source directly.
