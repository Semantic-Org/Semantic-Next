# @semantic-ui/rollup

Rollup plugin for Semantic UI. Adds the `?raw` and `?ast` import suffixes components use for their templates and styles. The same plugin drives Rolldown and Vite 8 through their Rollup-compatible plugin API.

## Install

```bash
npm install @semantic-ui/rollup
```

## Use

```js
// rollup.config.js
import semanticUI from '@semantic-ui/rollup';

export default {
  plugins: [semanticUI()],
};
```

Components can import their template and CSS as text:

```js
import template from './component.html?raw';
import css from './component.css?raw';
```

Or precompile the template to its AST at build time, so the runtime skips compilation:

```js
import ast from './component.html?ast';
defineComponent({ tagName: 'my-widget', ast, css });
```
