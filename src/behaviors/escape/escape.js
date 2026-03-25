import { registerBehavior } from '@semantic-ui/query';

import css from './escape.css?raw';

/*
  Escape behavior - promotes an element to the browser's top layer
  using the Popover API (popover="manual" + showPopover/hidePopover).

  The element stays in the DOM (anchor-name resolves correctly)
  but renders above all clipping ancestors. No DOM mutation.

  Uses string-based API since bare $el.escape() on an existing
  instance would trigger reinitialize (behavior system design).

  Usage:
  - `$el.escape('show')` - Promote to top layer
  - `$el.escape('hide')` - Remove from top layer
*/
export const Escape = registerBehavior({
  name: 'escape',
  namespace: 'escape',
  css,

  onCreated({ $el, self }) {
    $el.attr('popover', 'manual');
    self.isEscaped = false;
  },

  onDestroyed({ self }) {
    if (self.isEscaped) {
      self.hide();
    }
  },

  createBehavior: ({ el, self }) => ({
    show() {
      if (!self.isEscaped) {
        el.showPopover();
        self.isEscaped = true;
      }
    },
    hide() {
      if (self.isEscaped) {
        el.hidePopover();
        self.isEscaped = false;
      }
    },
  }),
});
