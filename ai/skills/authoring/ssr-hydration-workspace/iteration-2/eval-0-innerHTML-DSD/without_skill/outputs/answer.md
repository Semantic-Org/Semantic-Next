# Why `el.shadowRoot` is null and how to fix it

## Short answer

Replace `wrapper.innerHTML = html` with `wrapper.setHTMLUnsafe(html)`. The element-instance method `setHTMLUnsafe` parses Declarative Shadow DOM (DSD); the `innerHTML` setter does not. With `innerHTML`, the `<template shadowrootmode="open">` that `renderToString` emits stays as a literal `<template>` child in light DOM and no shadow root is ever attached, so `el.shadowRoot` is `null` when your assertion runs.

## What is actually in the SSR string

`renderToString` (in `packages/component/src/render-to-string.js`) wraps the component output like this:

```
<my-card title="Hello">
  <template shadowrootmode="open">
    <style>...</style>
    ...rendered content with hydration markers...
  </template>
  ...slot light DOM...
</my-card>
```

That `<template shadowrootmode="open">` is not a regular `<template>` — it is the Declarative Shadow DOM marker. When the HTML parser encounters it, it is supposed to:

1. Attach a shadow root on the parent custom element (`mode: "open"`).
2. Move the template's contents into that shadow root.
3. Remove the `<template>` element itself from the tree.

The parser only does that when DSD parsing is explicitly enabled. By spec, it is enabled in two places: the initial document parse (HTML loaded over the network) and the DOM API methods that opt into it. The `innerHTML` setter is intentionally NOT one of them — it has been the standard policy since DSD shipped, to avoid a subtle XSS escalation where existing code that injects untrusted HTML could now also be injecting shadow roots.

So when you do `wrapper.innerHTML = html`:
- The parser leaves `<template shadowrootmode="open">` as a literal `<template>` child of `<my-card>`.
- No shadow root is attached.
- The custom element upgrade fires `connectedCallback`, but because `this.shadowRoot` is `null`, the framework's branch for "DSD content present" is skipped entirely. (See `packages/component/src/engines/native/base.js`, `connectedCallback`: `const hasServerContent = this.shadowRoot && this.shadowRoot.childNodes.length > 0;`.)
- The framework then runs `fullRender` instead of `hydrate`. That eventually does call `attachShadow` and you get a shadow root populated by a fresh client render — but if you assert at the wrong moment (e.g. synchronously after appending), `el.shadowRoot` can still be `null`. Even if you wait for `rendered`, you are no longer testing hydration; you're testing client render of an element that happened to have a stray light-DOM `<template>` child.

## The fix

Use `Element.setHTMLUnsafe()`:

```js
const wrapper = document.createElement('div');
wrapper.setHTMLUnsafe(html);
const el = wrapper.firstElementChild;

const rendered = $(el).onNext('rendered');
document.body.appendChild(el);
await rendered;

expect(el.shadowRoot).toBeTruthy();
```

`setHTMLUnsafe` is the element-instance API specifically designed for this case: it parses with DSD enabled, so `<template shadowrootmode="open">` becomes the element's shadow root before you ever touch the DOM. By the time you read `wrapper.firstElementChild.shadowRoot`, the shadow root exists with the server content in it. When you append to `document.body`, `connectedCallback` then takes the `hasServerContent` branch and calls `hydrate(prototypeTemplate)` rather than `fullRender(...)` — wiring reactive bindings to the existing per-item DOM the server emitted.

The canonical comment from the framework's own hydration test (`packages/renderer/test/browser/ssr-hydration.test.js`, around line 54) makes the contract explicit:

> setHTMLUnsafe processes `<template shadowrootmode>`; innerHTML does not. Without this, the custom element parses with no shadowRoot, hasServerContent is false, and connectedCallback runs fullRender instead of hydrate.

## A few related gotchas worth pinning while you're here

- **Do not use `DOMParser.parseFromString(html, 'text/html')` either.** By default it also does not parse DSD. The opt-in there is the static `Document.parseHTMLUnsafe(html)` (which returns a full `Document`); that works too if you need a whole-document parse, but for injecting a single component into an existing test page, `setHTMLUnsafe` on a wrapper element is the natural fit.
- **`Template.isServer` matters in browser tests.** `renderToString` only emits the SSR (DSD) string when `Template.isServer` is `true`. In a browser test environment it defaults to `false`, so you will get client output unless you flip it. The framework's own helper does this:
  ```js
  const wasServer = Template.isServer;
  Template.isServer = true;
  try { html = renderToString(Component, attrs); }
  finally { Template.isServer = wasServer; }
  ```
  If your wrapper assertion is failing on `el.shadowRoot` being null, this is the second thing to check after `setHTMLUnsafe` — without `Template.isServer = true`, `renderToString` may not have produced a DSD string in the first place.
- **`rendered` is the right event to await for hydration.** The framework's `connectedCallback` schedules `hydrate` via `queueMicrotask`, so you cannot read `el.shadowRoot.querySelector(...)` synchronously after `appendChild`. `await $(el).onNext('rendered')` is what the in-repo tests use, and it resolves after `template.markRendered()` inside `hydrate`.
- **Do not assert the absence of comment markers right after `rendered`.** The hydration scaffolding (`<!-- sui:v1: ... -->` comments and `data-sui-bind="..."` attributes) is removed in a `requestAnimationFrame` callback after hydration, one tick later than the `rendered` event. If your test wants to compare `shadowRoot.innerHTML` strings, strip them yourself, the way the in-repo tests do (`shadowHTML(el)` helper). Otherwise an assertion that "the per-item DOM the server emitted" matches your expected string will fail because the server's per-item DOM is still wrapped in those markers.

## Why this trips people up

`innerHTML` is the muscle-memory API for "parse this string into DOM," and `setHTMLUnsafe` looks like a scary scoped variant. It is actually the opposite: `setHTMLUnsafe` is more permissive (it allows DSD), and `innerHTML` is the "safe" default that strips it. For anything involving `renderToString` output from `@semantic-ui/component`, you want the more permissive one — the whole point of the SSR string is the DSD inside it.
