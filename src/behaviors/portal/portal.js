import { registerBehavior } from '@semantic-ui/query';
import { isDOM, isString } from '@semantic-ui/utils';

/*
  Moves a DOM element to a new parent context ("portal") on the client
  and returns it on destruction. This is SSR-safe and escapes
  CSS stacking and overflow contexts.

  Settings:
  ┌─────────┬──────────────────┬─────────────────────────────────────────────────┐
  │ Setting │ Default          │ Description                                     │
  ├─────────┼──────────────────┼─────────────────────────────────────────────────┤
  │ context │ 'auto'           │ Target context to portal the element to:       │
  │         │                  │ - 'auto': Element's positioningParent()        │
  │         │                  │ - 'body': document.body (ideal for modals)     │
  │         │                  │ - '.selector' or HTMLElement: Specific element │
  └─────────┴──────────────────┴─────────────────────────────────────────────────┘

  - `$(el).portal(true)`: Portals to default 'auto' context.
  - `$(el).portal(false)`: Restores element to original parent.
  - `$(el).portal('.my-context')`: Portals to a specific context.

*/
export const Portal = registerBehavior({
  name: 'portal',
  namespace: 'portal',

  defaultSettings: {
    context: 'auto',
  },

  /*
    Progressive enhancement: element renders inline (SSR-friendly),
    then portals on the client after creation
  */
  onCreated({ self, $el }) {
    self.$originalParent = $el.parent();
    self.$context = null;
    self.isPortaled = false;

    self.portal();
  },

  onDestroyed({ self }) {
    self.restore();
  },

  customInvocation({ self, methodName, methodArgs }) {
    if (methodName === true) {
      return self.portal();
    }
    if (methodName === false) {
      return self.restore();
    }
    if (isString(methodName) || isDOM(methodName)) {
      return self.portal({ context: methodName });
    }
  },

  createBehavior: ({ self, $el, $, settings, log }) => ({
    portal(newSettings) {
      const config = { ...settings, ...newSettings };
      let $context;

      if (config.context === 'auto') {
        $context = $el.positioningParent();
      }
      else {
        $context = $(config.context);
      }

      if (!$context?.exists()) {
        log.error('Portal context not found:', config.context);
        return;
      }

      // Avoid moving if already in the correct context
      if (self.isPortaled && self.$context.el() === $context.el()) {
        return;
      }

      // If portaled elsewhere, restore first before moving
      if (self.isPortaled) {
        self.restore();
      }

      $el.detach().appendTo($context);

      self.isPortaled = true;
      self.$context = $context;
    },

    restore() {
      if (!self.isPortaled) {
        return;
      }

      const { $originalParent } = self;
      if ($originalParent?.exists()) {
        $el.detach().appendTo($originalParent);
      }
      else {
        // Original parent is gone, just detach
        $el.detach();
        log.warn('Original parent not found, element detached.');
      }

      self.isPortaled = false;
      self.$context = null;
    },
  }),
});
