/*
  Astro server renderer for Semantic UI components.
  Thin adapter — all SSR logic lives in renderToString.
*/

import { renderToString } from '@semantic-ui/component';

export default {
  check(Component) {
    return Component?.template?.ast !== undefined;
  },

  renderToStaticMarkup(Component, props, slotted) {
    const html = renderToString(Component, props, { slots: slotted });
    return { html };
  },
};
