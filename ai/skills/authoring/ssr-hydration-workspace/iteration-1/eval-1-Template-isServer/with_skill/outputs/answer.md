# Why `renderToString` returns an empty `<template>` in your Vitest browser test

## The root cause: `Template.isServer` is computed from `typeof window`

`renderToString` does not pick the server vs client renderer based on what you call. It picks based on the static flag `Template.isServer`, which is initialized once at module load from this expression in `@semantic-ui/utils`:

```js
// packages/utils/src/environment.js
export const isServer = (() => {
  return typeof window === 'undefined';
})();
```

That value is then frozen onto the Template class:

```js
// packages/templating/src/template.js
import { isServer } from '@semantic-ui/utils';
// ...
export const Template = class Template {
  static isServer = isServer;
  // ...
};
```

And the engine selection inside `Template.initialize()` consults exactly that flag:

```js
// packages/templating/src/template.js (line 292)
const RendererClass = (Template.isServer && engine.serverRenderer)
  ? engine.serverRenderer
  : engine.renderer;
```

In a Vitest **browser** test (`vitest --browser`, Playwright/WebDriver runner), `window` exists. So:

- `isServer` is `false`
- `Template.isServer` is `false`
- `RendererClass` is `engine.renderer` — the **client** `Renderer`, not `ServerRenderer`

You called `renderToString`, but the template was wired up with the client renderer that produces a live DOM `DocumentFragment`, not the server renderer that produces an HTML string.

## Why the output looks empty

`renderToString` then does this at line 67 of `packages/component/src/render-to-string.js`:

```js
let html = template.render();
// ...
html = expandCustomElements(html, { depth, hydrate, renderFn: renderToString });
// ...
return `<${tagName}...><template shadowrootmode="open">${css ? `<style>${css}</style>` : ''}${html}</template>...</${tagName}>`;
```

When `template.render()` ran through the client `Renderer.render()` (line 157 of `packages/renderer/src/engines/native/renderer.js`), it returned a `DocumentFragment` — not a string. Two things then happen:

1. `expandCustomElements(html, ...)` walks `html` as a string (`html.length`, `html.indexOf('<')`, etc.). A `DocumentFragment` coerced to string is `"[object DocumentFragment]"`, which contains no `<` and no registered tag names. It passes through.
2. The final template-literal interpolation coerces the fragment to a string. Depending on how your snapshot strips it, you can see an empty body or stray text — the items never appear because the each block was expanded into live DOM nodes inside a fragment that was never serialized to HTML.

The data merge, the `each` block, and `defaultSettings` are all fine. None of the SSR string-emission path ran.

## The fix: toggle `Template.isServer` around the call

The framework's own SSR-in-browser tests do exactly this. From `packages/renderer/test/browser/ssr-hydration.test.js` (lines 39–52):

```js
async function ssrAndHydrate(opts, attrs = {}) {
  const tag = uniqueTag();
  const Component = defineComponent({ tagName: tag, renderingEngine: 'native', ...opts });

  // Toggle Template.isServer so renderToString actually emits SSR HTML in
  // the browser test env (it gates server vs client renderer selection).
  const wasServer = Template.isServer;
  Template.isServer = true;
  let html;
  try {
    html = renderToString(Component, attrs);
  }
  finally {
    Template.isServer = wasServer;
  }
  // ...
}
```

For your test:

```js
import { Template } from '@semantic-ui/templating';
import { renderToString } from '@semantic-ui/component';

it('renders items', () => {
  const wasServer = Template.isServer;
  Template.isServer = true;
  let html;
  try {
    html = renderToString(MyComponent, { items: [...] });
  } finally {
    Template.isServer = wasServer;
  }
  expect(html).toContain('<li>');
});
```

Always restore in a `finally` — leaving `Template.isServer = true` for the rest of the test file will break any test that mounts a real component (mounting paths bail out of client-only logic, and `template.render()` returns strings instead of fragments).

## If your test also injects the DSD into the page

There's a second gotcha worth flagging because the same test file documents it (line 54): use `setHTMLUnsafe`, not `innerHTML`, when injecting the resulting DSD. `innerHTML` does not process `<template shadowrootmode>` — the custom element will parse with no `shadowRoot`, `connectedCallback` will see no DSD, and you'll get a full client render instead of hydration:

```js
const wrapper = document.createElement('div');
wrapper.setHTMLUnsafe(html);
const el = wrapper.firstElementChild;
document.body.appendChild(el); // triggers hydration
```

## Why the Node-side SSR path "just works"

When you SSR from Node (Astro build, a Node script, a Node-environment Vitest test), `window` is undefined at module load, so `isServer === true` from the start. `Template.isServer` is correct without any toggling. The browser test environment is the one place this leaks because the `isServer` constant is captured eagerly, not recomputed per call — and there's no per-call override on `renderToString` to force the server engine.

## Files referenced

- `/home/jack/semantic/next/packages/component/src/render-to-string.js`
- `/home/jack/semantic/next/packages/templating/src/template.js` (lines 43, 292)
- `/home/jack/semantic/next/packages/utils/src/environment.js` (lines 5–7)
- `/home/jack/semantic/next/packages/renderer/src/engines/native/renderer.js` (lines 157–163)
- `/home/jack/semantic/next/packages/renderer/test/browser/ssr-hydration.test.js` (lines 39–67) — canonical pattern for this exact scenario
