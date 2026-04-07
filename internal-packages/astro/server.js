/*
  Astro server renderer for Semantic UI components.
  Thin adapter — all SSR logic lives in renderToString.
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
      hydrate: metadata?.hydrate,
    });
    return { html };
  },
};
