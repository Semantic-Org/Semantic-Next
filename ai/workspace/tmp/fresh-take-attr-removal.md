## Task: Evaluate the DOM implications of removing data attributes from elements during a requestAnimationFrame callback

This is a focused theoretical question about browser behavior. No source files need to be read.

### Context

A web component framework uses Declarative Shadow DOM for server-side rendering. During server rendering, the framework adds a `data-sui-bind` attribute to elements that have dynamic attribute bindings. This attribute contains metadata the client uses during hydration to wire reactive bindings to the correct elements without needing a reference DOM.

After hydration completes, the `data-sui-bind` attributes are no longer needed. The plan is to strip them in a `requestAnimationFrame` callback (deferred one frame from hydration). The removal would look like:

```js
requestAnimationFrame(() => {
  const walker = document.createTreeWalker(shadowRoot, NodeFilter.SHOW_ELEMENT);
  let el;
  while ((el = walker.nextNode())) {
    if (el.hasAttribute('data-sui-bind')) {
      el.removeAttribute('data-sui-bind');
    }
  }
});
```

This runs inside a shadow root. A typical component might have 5-20 elements with the attribute. A page might have 20-50 such components.

### Questions — Evaluate Independently

**Question 1:** What are the concrete browser-internal consequences of calling `removeAttribute` on a `data-*` attribute that is not referenced by any CSS selector, not observed by any JavaScript, and exists inside a shadow root? Walk through what the browser engine actually does: DOM tree mutation, attribute storage update, style invalidation (if any), layout invalidation (if any), paint invalidation (if any). Be specific about which steps are skipped when no selector matches.

**Question 2:** How does `removeAttribute` inside a shadow root differ from `removeAttribute` in the light DOM with respect to style invalidation scope? Does the shadow boundary limit the invalidation check to the shadow root's stylesheets, or does the browser check the full document stylesheet list?

**Question 3:** What happens if a CSS selector like `[data-sui-bind]` does exist — for example, in a user's stylesheet or a browser extension's injected styles? What is the worst-case performance impact of removing the attribute from 1000 elements in a single rAF callback? Consider style recalculation cascade, layout thrashing, and paint invalidation.

**Question 4:** Are there any edge cases or non-obvious browser behaviors triggered by `removeAttribute` on elements inside a shadow root? Consider: custom element `attributeChangedCallback` (for elements that observe the attribute), `MutationObserver` notifications, accessibility tree updates, SVG namespace handling, and interaction with the browser's incremental rendering pipeline.

**Question 5:** Compare the DOM mutation cost profile of removing a `data-*` attribute from an element vs removing a comment node from the DOM. Which operation is cheaper and why? Consider both the direct cost and any downstream invalidation work.
