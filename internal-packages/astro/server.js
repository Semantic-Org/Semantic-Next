/*
  Astro server renderer for Semantic UI components.
  Thin adapter — all SSR logic lives in renderToString.

  check() only claims component class references (e.g. <Icon>). Raw custom
  element tags (<ui-icon>) pass through as plain HTML and self-initialize
  on the client — SSR-rendering them would cause double hydration.
*/

import { renderToString } from '@semantic-ui/component';

export default {
  name: '@semantic-ui/astro',
  supportsAstroStaticSlot: true,

  check(Component) {
    return Component?.template?.ast !== undefined;
  },

  renderToStaticMarkup(Component, props, slotted, metadata) {
    const html = renderToString(Component, props, {
      slots: slotted,
      hydrate: !!metadata?.hydrate,
    });
    return { html };
  },
};
