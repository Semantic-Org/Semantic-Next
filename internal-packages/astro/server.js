/*
  Astro server renderer for Semantic UI components.
  Thin adapter — all SSR logic lives in renderToString.

  Astro passes two kinds of values to check():
  - Component references from imports (e.g. <Icon> → the defineComponent class)
  - Tag name strings for custom elements (e.g. <ui-icon> → "ui-icon")

  Both are supported. String tag names are resolved from the component registry
  which is populated by defineComponent's registerComponent() call on the server.
*/

import { getComponent, renderToString } from '@semantic-ui/component';

function isCustomElementTag(value) {
  return typeof value === 'string' && value.includes('-');
}

export default {
  name: '@semantic-ui/astro',
  supportsAstroStaticSlot: true,

  check(Component) {
    // Only claim component class references (e.g. <Icon>) — not raw
    // custom element tag names (e.g. <ui-icon>). Raw tags should pass
    // through as plain HTML and self-initialize on the client.
    return Component?.template?.ast !== undefined;
  },

  renderToStaticMarkup(Component, props, slotted, metadata) {
    if (isCustomElementTag(Component)) {
      Component = getComponent(Component);
    }
    const html = renderToString(Component, props, {
      slots: slotted,
      hydrate: !!metadata?.hydrate,
    });
    return { html };
  },
};
