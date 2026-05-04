# Why `renderToString` emits an empty DSD in Vitest browser mode

## Root cause: `Template.isServer` is `false` in a real browser

`renderToString` is renderer-agnostic — it builds a `Template`, calls `template.initialize()`, then `template.render()`, and string-concatenates the result into the DSD wrapper. The renderer that gets instantiated is selected here:

`packages/templating/src/template.js:292`
```js
const RendererClass = (Template.isServer && engine.serverRenderer)
  ? engine.serverRenderer
  : engine.renderer;
```

`Template.isServer` is initialized once, at module load, from `@semantic-ui/utils`:

`packages/utils/src/environment.js:5`
```js
export const isServer = (() => {
  return typeof window === 'undefined';
})();
```

In Node SSR, `window` is undefined → `isServer === true` → the **server** renderer is selected → `template.render()` returns an HTML string → `renderToString` concatenates it into the DSD and you get fully-populated `each` output.

In Vitest **browser** mode (`@vitest/browser` driving Chromium / Firefox / WebKit / Playwright), `window` is a real browser global. `typeof window === 'undefined'` is `false`, so `Template.isServer` is `false`, and the **client** renderer (`engines/native/renderer.js`) is selected. Its `render()` returns a `DocumentFragment`, not a string:

`packages/renderer/src/engines/native/renderer.js:157`
```js
render() {
  return this.readAST({ ast: this.ast, data: this.data, scope: this.scope });
}
// ...
return fragment;  // DocumentFragment
```

## Why the inner template is *empty*, not garbled

Look at what `renderToString` does with that value:

`packages/component/src/render-to-string.js:67`
```js
let html = template.render();                // DocumentFragment in browser env
html = expandCustomElements(html, { ... });  // string-only function
```

`expandCustomElements` is written for strings:

`packages/component/src/expand-custom-elements.js:25`
```js
while (pos < html.length) {  // DocumentFragment.length is undefined
  ...
}
```

`pos < undefined` is `false`, so the loop body never runs and the function returns `''` (its `result` accumulator). Then the wrapper is built around an empty string:

```js
return `<${tagName}...>`
  + `<template shadowrootmode="open">`
  + (css ? `<style>${css}</style>` : '')
  + html                          // ''
  + `</template>`
  + slotHTML
  + `</${tagName}>`;
```

→ exactly the symptom you see:
```
<my-component><template shadowrootmode="open"></template></my-component>
```

(If your component happens to have a `css` block, you'll see a `<style>` inside the template but still no markup.)

## The Node SSR path "just works" because of module load order

When the test runner is Node (jsdom or node mode), `window` is undefined at the time `@semantic-ui/utils/environment.js` is first imported, so `isServer` evaluates to `true` and is captured into `Template.isServer`. Even if jsdom later adds a `window` global, the constant has already been frozen. That's why your Node-side rendering works and your browser-side rendering is empty — it's not about your component, your `defaultSettings`, your `each` block, or your data; it's purely about which renderer class got chosen at `initialize()` time.

## Fix

Force `Template.isServer = true` for the duration of the `renderToString` call. The repo's own browser tests do exactly this — see `packages/renderer/test/browser/ssr-hydration.test.js:39`:

```js
import { defineComponent, renderToString } from '@semantic-ui/component';
import { Template } from '@semantic-ui/templating';

function ssrInBrowser(Component, attrs) {
  const wasServer = Template.isServer;
  Template.isServer = true;
  try {
    return renderToString(Component, attrs);
  }
  finally {
    Template.isServer = wasServer;
  }
}
```

Wrap your `renderToString` call in that `try/finally`. The flag has to be set **before** `renderToString` is invoked (because `template.initialize()` reads it once and instantiates the renderer right then) and restored after (so any subsequent client-side code in the same test — hydration, mount, reactivity assertions — still gets the DOM renderer). The flag is read on every `initialize()`, so per-call toggling is safe and doesn't leak across tests as long as the `finally` runs.

A few practical notes:

- Do this in a small helper rather than inline, and call it from every test that needs the SSR string. Forgetting the toggle is the single failure mode.
- Don't set `Template.isServer = true` globally in a `beforeAll` — it will break any test in the same file that exercises the live client renderer (mount, hydrate, reactive update).
- If you also want to verify hydration end-to-end (inject the DSD, let the browser parse `<template shadowrootmode="open">`, then upgrade the custom element), use `wrapper.setHTMLUnsafe(html)` instead of `innerHTML`. Plain `innerHTML` does not process declarative shadow DOM, so the element parses with no shadow root and `connectedCallback` falls back to a full client render — making your test a non-hydration test by accident. The browser test in `ssr-hydration.test.js:58` shows the pattern.
- Nothing about `defaultSettings`, the `each` block, or your `items` data is involved. The component is fine. The fix is one line of test scaffolding.

## Why the framework doesn't autodetect this

`renderToString` could in principle override the engine selection itself (it already passes `renderingEngine: 'native'` to `proto.clone()`), but it currently delegates the server-vs-client decision to `Template.isServer`, which is a process-wide flag derived from `typeof window`. In the canonical use case — calling `renderToString` from a Node/Bun/Workers SSR path — that's correct and zero-config. The browser test environment is the edge case where the flag's heuristic is wrong, and the framework's own test suite handles it with the same toggle pattern shown above. Treat it as a known wart of running SSR code in a browser-mode test runner, not a bug in your component.

## Relevant source files

- `/home/jack/semantic/next/packages/component/src/render-to-string.js` — the entry point; line 67 calls `template.render()`, lines 84–90 build the DSD wrapper.
- `/home/jack/semantic/next/packages/templating/src/template.js` — line 43 captures `Template.isServer` from `utils`; lines 292–294 select the server vs. client renderer class.
- `/home/jack/semantic/next/packages/utils/src/environment.js` — line 5 defines `isServer = typeof window === 'undefined'`.
- `/home/jack/semantic/next/packages/renderer/src/engines/native/renderer.js` — line 157 `render()` returns a `DocumentFragment`.
- `/home/jack/semantic/next/packages/renderer/src/engines/native/server.js` — the alternative ServerRenderer that returns a string.
- `/home/jack/semantic/next/packages/component/src/expand-custom-elements.js` — line 25 string-only `while (pos < html.length)` silently no-ops on a `DocumentFragment`.
- `/home/jack/semantic/next/packages/renderer/test/browser/ssr-hydration.test.js` — lines 39–67 are the canonical browser-test pattern (`Template.isServer = true` toggle plus `setHTMLUnsafe`).
