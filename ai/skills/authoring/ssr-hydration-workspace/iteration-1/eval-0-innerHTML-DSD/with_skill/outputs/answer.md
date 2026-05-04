# Why your `el.shadowRoot` is null

## Short answer

`wrapper.innerHTML = html` does not process `<template shadowrootmode="open">`. The DSD template stays as a literal `<template>` child of your custom element instead of being attached as a shadow root. Replace it with `wrapper.setHTMLUnsafe(html)` (or `Document.parseHTMLUnsafe(html)`).

## What is actually happening

`renderToString` in `packages/component/src/render-to-string.js` produces:

```html
<my-el ...>
  <template shadowrootmode="open">
    <style>...</style>
    <!-- per-item DOM with hydration markers -->
  </template>
</my-el>
```

The DSD spec says: when the **HTML parser** encounters `<template shadowrootmode="open">` as a direct child of an element, it creates a shadow root on the parent, moves the template's content into it, and discards the `<template>` element. The parser does this exactly once per element during parsing.

Critically, the spec restricts this behavior to the **streaming HTML parser** the browser uses for the initial document load. The **fragment parsers** — `Element.innerHTML`, `Element.outerHTML`, and `Element.insertAdjacentHTML` — explicitly do NOT process `<template shadowrootmode>`. They leave the `<template>` element as a literal child node. This is by design (DSD-by-`innerHTML` would be an XSS vector against existing pages). To opt in from script you have to use the explicit unsafe variants: `Element.setHTMLUnsafe()` or `Document.parseHTMLUnsafe()`.

So with `wrapper.innerHTML = html`:

1. The custom element parses with **no shadow root**. The `<template shadowrootmode="open">` becomes a regular child element.
2. When you `appendChild` the wrapper, the browser upgrades the custom element and calls `connectedCallback`.
3. In `packages/component/src/engines/native/base.js` the decision is:

   ```js
   const hasServerContent = this.shadowRoot && this.shadowRoot.childNodes.length > 0;
   // ...
   if (hasServerContent && this.canHydrate()) {
     queueMicrotask(() => this.hydrate(prototypeTemplate));
   } else {
     // ...
     this.fullRender(prototypeTemplate);
   }
   ```

   Because `this.shadowRoot` is `null`, `hasServerContent` is `false`. The element falls through the `!this.shadowRoot` branch, calls `this.attachShadow({ mode: 'open', ... })`, and runs `fullRender(prototypeTemplate)` — a fresh client render from scratch.
4. `fullRender` creates and returns a brand-new shadow root **at a different time than your assertion**. Even when it eventually populates a shadow root, the path you took is the client-render path, not hydration. The per-item DOM the server emitted (with `<!--sui-item:v1:KEY-->` markers, etc.) was never adopted — the orphaned `<template>` child is still sitting in light DOM.

The 'rendered' event you await fires on that fullRender path too, so the `await` resolves and your assertion runs — but it is asserting against the wrong execution. This is the silent-failure mode: there is no error, no warning, the test "succeeds" in the sense that the component eventually renders something, but you are testing `fullRender`, not `hydrate`. Per-item hydration assertions (and anything that depends on server-emitted markers) will fail or, worse, appear to pass for the wrong reason.

## The fix

```js
const wrapper = document.createElement('div');
wrapper.setHTMLUnsafe(html);                    // processes <template shadowrootmode>
const el = wrapper.firstElementChild;

const rendered = $(el).onNext('rendered');
document.body.appendChild(el);
await rendered;

// el.shadowRoot is now the DSD-attached root with the server's per-item DOM
expect(el.shadowRoot).toBeTruthy();
```

`Element.setHTMLUnsafe()` runs the same fragment-parsing path as `innerHTML` but **opts in** to DSD processing. The custom element parses with a real, populated `shadowRoot`. When you append it to the document and `connectedCallback` runs, `hasServerContent` is `true`, `canHydrate()` finds the versioned `sui:v1:` / `sui-block:v1:` markers, and the element takes the `queueMicrotask(() => this.hydrate(prototypeTemplate))` path. The 'rendered' event you await then comes from the real hydration pass, and `el.shadowRoot` contains the per-item DOM the server emitted with Reactions wired to the existing nodes.

`Document.parseHTMLUnsafe(html)` is the alternative if you want to construct a whole document; for an element-scoped wrapper, `setHTMLUnsafe` on the wrapper is the closer drop-in for `innerHTML =`.

## Why this trap is easy to fall into

This bug class is in the SSR hydration workspace's "lessons learned" notes (`ai/plans/archive/hydrate-each-external-state.md`): an entire test helper used `wrapper.innerHTML = html` and every "SSR hydration" test in the file was actually exercising `fullRender`. It hid a real hydration bug for hours because the tests "passed" against the wrong code path. The repo's canonical SSR test helper now uses `setHTMLUnsafe` and carries an inline comment explaining exactly this — see `packages/renderer/test/browser/ssr-hydration.test.js:54-58`:

```js
// setHTMLUnsafe processes <template shadowrootmode>; innerHTML does not.
// Without this, the custom element parses with no shadowRoot, hasServerContent
// is false, and connectedCallback runs fullRender instead of hydrate.
const wrapper = document.createElement('div');
wrapper.setHTMLUnsafe(html);
```

If you're writing a new SSR hydration test, model it on that helper — it also handles two other gotchas you'll hit immediately after this one (toggling `Template.isServer = true` around `renderToString` so the server renderer is selected in a browser env, and stripping `data-sui-bind` from `shadowHTML` for stable assertions).
