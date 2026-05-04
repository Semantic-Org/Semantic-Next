# Why `el.shadowRoot` is `null` in your hydration test

## What's happening

`wrapper.innerHTML = html` is silently throwing away the Declarative Shadow DOM. There is no error — the element is in the page, the `rendered` event fires, but it fired for the wrong reason. You are not testing hydration; you are testing a fresh client render that happens to start from a server-rendered string.

The chain of events:

1. The browser's **main HTML parser** processes `<template shadowrootmode="open">` natively — that's why an SSR'd page works in production. But the **fragment parsers** (`innerHTML`, `outerHTML`, `insertAdjacentHTML`) **do not**. The DSD spec deliberately opts those out because injecting attacker-controlled HTML into an existing shadow root is an XSS escalation vector.
2. So when you write `wrapper.innerHTML = renderToString(...)`, the `<template shadowrootmode="open">…</template>` stays as a literal `<template>` child of your custom element. It is not unwrapped. The element has no shadow root.
3. The browser appends the element, the upgrade runs, and the constructor checks `if (this.shadowRoot)` to decide whether to set `_hydrating = true`. It's `null`, so the flag stays false.
4. `connectedCallback` then evaluates `hasServerContent = this.shadowRoot && this.shadowRoot.childNodes.length > 0`. With a null `shadowRoot`, that's `false`.
5. The component falls through to `this.fullRender(prototypeTemplate)` — the standard client path. `fullRender` calls `attachShadow({ mode: 'open' })` itself, builds the template from scratch, and emits the `rendered` event you're awaiting.
6. Now `el.shadowRoot` is finally non-null, but the time-of-check vs. time-of-await ordering you wrote treats it as null, OR the assertion runs against a freshly-rendered shadow root that — depending on what your component does in `createComponent` — may not match what the server emitted (e.g. server-only branches, marker-derived per-item DOM, etc.).

That last point is the real bite for your test: even if you'd later see a non-null `shadowRoot`, **you'd be asserting against a client render, not against the server's per-item DOM**. The test would pass or fail for entirely the wrong reason.

## The fix

Use **`setHTMLUnsafe`** (or `Document.parseHTMLUnsafe` for a document-scoped variant). Both go through HTML parser entry points that the spec explicitly enables for DSD processing:

```js
// Element-scoped — what you want for a wrapper div
const wrapper = document.createElement('div');
wrapper.setHTMLUnsafe(html);
const el = wrapper.firstElementChild;

document.body.appendChild(el);
await $(el).onNext('rendered');

// Now el.shadowRoot is the DSD-parsed root, hasServerContent is true,
// and connectedCallback takes the hydrate() path.
```

The "Unsafe" suffix is misleading in this context — it does not mean "unsafe in a test"; it means "this method bypasses the XSS-escalation guard that the regular fragment parsers enforce." For SSR test fixtures where you control the input string, it's exactly the right tool.

This is the only DOM API change you need. Everything downstream — `el.shadowRoot` being non-null at constructor time, `_hydrating` flag set, `canHydrate()` finding the `sui:v1:` markers, `requestAnimationFrame(() => hydrate(...))` deferring one frame, the `rendered` event firing after the hydration wiring completes — all of that follows automatically once the parser actually creates the shadow root from the `<template shadowrootmode>`.

## One related gotcha to check while you're in there

If your test runs in a Vitest browser environment, also confirm that `renderToString` is producing real SSR output and not an empty DSD wrapper. `Template.isServer` is set once at module load from `typeof window === 'undefined'`. In the browser test env, `window` exists, so `Template.isServer === false`, and the renderer-selection inside `Template.initialize()` picks the client `Renderer` — which returns a `DocumentFragment` that the `renderToString` template literal coerces to `'[object DocumentFragment]'` (or empty after `expandCustomElements` no-ops on it). The DSD wrapper is emitted but the inside is empty.

Wrap the call in a `try/finally` toggle:

```js
const wasServer = Template.isServer;
Template.isServer = true;
let html;
try {
  html = renderToString(Component, attrs);
} finally {
  Template.isServer = wasServer;
}
```

The `finally` matters — leaving `Template.isServer = true` after the call would break any subsequent client-side mount in the same test run, because the renderer selection only happens once per `template.initialize()`.

## Canonical reference

The helper you should mirror is `ssrAndHydrate` in `/home/jack/semantic/next/packages/renderer/test/browser/ssr-hydration.test.js` (lines 39-67). It does exactly the two things above — `Template.isServer` toggle around `renderToString`, then `wrapper.setHTMLUnsafe(html)` instead of `innerHTML` — and is the pattern every SSR-hydration browser test in the repo is built on. If you can use it directly rather than rolling your own, do.

## Why this matters beyond your single test

This is one of the canonical silent-failure modes for SSR work in this framework. There is no error and no warning. Tests pass for the wrong reason; benches measure `fullRender` instead of `hydrate` and report wrong numbers. If you're authoring more SSR tests or perf benchmarks, treat `setHTMLUnsafe` + `Template.isServer` toggle as a single non-negotiable pair — they are the entry conditions for the hydration code path even existing.
