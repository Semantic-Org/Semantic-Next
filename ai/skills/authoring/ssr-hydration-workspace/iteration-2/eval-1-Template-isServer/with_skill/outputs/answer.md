# Why `renderToString` is empty in your browser test

You've hit a known silent-failure mode. Your component, settings, and template are all fine — the problem is that `renderToString` is picking the **client renderer** instead of the server one, because of how engine selection is gated.

## What's happening

`Template.isServer` is set **once at module load** from `typeof window === 'undefined'` (in `@semantic-ui/utils`). In a vitest browser test, `window` exists, so `Template.isServer === false` for the entire run.

Inside `Template.initialize()` the engine selection looks like this (`packages/templating/src/template.js:292`):

```js
const RendererClass = (Template.isServer && engine.serverRenderer)
  ? engine.serverRenderer
  : engine.renderer;
```

So in the browser env, `renderToString` ends up using the **client `Renderer`**, which returns a `DocumentFragment` from `render()` rather than an HTML string. That fragment gets coerced into the surrounding template literal as `'[object DocumentFragment]'`, then the string-only `expandCustomElements` no-ops on it, and the DSD wrapper is emitted with nothing inside the `<template shadowrootmode="open">`.

That matches your symptom exactly:

```
<my-component><template shadowrootmode="open"></template></my-component>
```

It's not your `each` block, not `defaultSettings`, not the data shape — it's the renderer selection. On Node the same code works because `window` is undefined and `Template.isServer` is `true`.

## The fix

Toggle `Template.isServer = true` around the call, with a `try/finally` so it gets restored:

```js
import { Template } from '@semantic-ui/templating';
import { renderToString } from '@semantic-ui/component';

const wasServer = Template.isServer;
Template.isServer = true;
let html;
try {
  html = renderToString(MyComponent, { items: [...] });
} finally {
  Template.isServer = wasServer;
}
```

The `try/finally` is load-bearing. If you leave `Template.isServer = true` after the call, any subsequent client-side hydration or mount in the same test breaks, because renderer selection happens once per `template.initialize()` and you've now flipped every component into the server engine.

## If you also plan to inject the HTML and let it hydrate

Don't use `innerHTML` — it does **not** process Declarative Shadow DOM. The fragment parsers (`innerHTML`, `outerHTML`, `insertAdjacentHTML`) are opted out of DSD by spec for XSS reasons. Use `setHTMLUnsafe` (or `Document.parseHTMLUnsafe`):

```js
const wrapper = document.createElement('div');
wrapper.setHTMLUnsafe(html);   // shadow root attaches; innerHTML would not
const el = wrapper.firstElementChild;
document.body.appendChild(el); // triggers connectedCallback → hydrate
```

With `innerHTML` your test will silently appear to work but actually exercise `fullRender` (client-only) instead of `hydrate`, because `el.shadowRoot` is `null` when `connectedCallback` fires and `hasServerContent` is false.

## Canonical helper to copy

`packages/renderer/test/browser/ssr-hydration.test.js` has the canonical `ssrAndHydrate` helper that does both pieces correctly. Worth pattern-matching against rather than rolling your own:

```js
async function ssrAndHydrate(opts, attrs = {}) {
  const tag = uniqueTag();
  const Component = defineComponent({ tagName: tag, renderingEngine: 'native', ...opts });

  const wasServer = Template.isServer;
  Template.isServer = true;
  let html;
  try {
    html = renderToString(Component, attrs);
  } finally {
    Template.isServer = wasServer;
  }

  const wrapper = document.createElement('div');
  wrapper.setHTMLUnsafe(html);
  const el = wrapper.firstElementChild;

  const rendered = $(el).onNext('rendered');
  document.body.appendChild(el);
  await rendered;
  return el;
}
```

## Summary

- **Root cause:** `Template.isServer` is computed once at module load from `typeof window`. In a browser test it's `false`, so `renderToString` selects the client `Renderer` (returns a `DocumentFragment`) instead of the `ServerRenderer` (returns a string). The DSD wrapper string is emitted but nothing fills the inside.
- **Fix:** Set `Template.isServer = true` with `try/finally` around your `renderToString` call.
- **If injecting + hydrating:** also use `setHTMLUnsafe`, never `innerHTML`. `innerHTML` skips DSD processing and your test will silently measure the wrong code path.
- **Reference:** `packages/renderer/test/browser/ssr-hydration.test.js` (`ssrAndHydrate`).
