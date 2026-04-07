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
    // Component reference — e.g. <Icon>
    if (Component?.template?.ast !== undefined) {
      return true;
    }
    // Custom element tag name — e.g. <ui-icon>
    if (isCustomElementTag(Component)) {
      return !!getComponent(Component);
    }
    return false;
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
