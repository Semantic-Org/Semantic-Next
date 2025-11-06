import { registerBehavior } from '@semantic-ui/query';
import { isDOM, isString } from '@semantic-ui/utils';

// Moves a DOM element to a new parent context ("portal") on the client
// and returns it on destruction. This is SSR-safe and escapes
// CSS stacking and overflow contexts.
export const Portal = registerBehavior({
  name: 'portal',
  namespace: 'portal',

  defaultSettings: {
    // The target context to portal the element to.
    // - `auto`: (Default) Moves to the element's `positioningParent()`.
    //   This keeps the element within its local scroll container.
    // - `'body'`: Moves to `document.body`. Ideal for modals.
    // - `'.selector'` or `HTMLElement`: Moves to the specified element.
    context: 'auto',
  },

  // Stores the element's original location for cleanup.
  initialState: {
    $originalParent: null,
    $context: null,
    isPortaled: false,
  },

  // --- Lifecycle Hooks ---

  // This is the "Progressive Enhancement" step. The element
  // renders inline (SSR-friendly), and we *then* portal it
  // on the client after it's created.
  onCreated({ self, $el }) {
    self.state.$originalParent = $el.parent();
    self.portal();
  },

  // The framework's auto-cleanup calls this to restore the element.
  onDestroyed({ self }) {
    self.restore();
  },

  // Handles simple invocations:
  // - `$(el).portal(true)`: Portals to default 'auto' context.
  // - `$(el).portal(false)`: Restores element to original parent.
  // - `$(el).portal('.my-context')`: Portals to a specific context.
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

  // --- Behavior API ---
  createBehavior: ({ self, $el, $, state, settings, log }) => ({
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
      if (state.isPortaled && state.$context.el() === $context.el()) {
        return;
      }

      // If portaled elsewhere, restore first before moving
      if (state.isPortaled) {
        self.restore();
      }

      $el.detach().appendTo($context);

      state.isPortaled = true;
      state.$context = $context;
    },

    restore() {
      if (!state.isPortaled) {
        return;
      }

      const { $originalParent } = state;
      if ($originalParent?.exists()) {
        $el.detach().appendTo($originalParent);
      }
      else {
        // Original parent is gone, just detach
        $el.detach();
        log.warn('Original parent not found, element detached.');
      }

      state.isPortaled = false;
      state.$context = null;
    },
  }),
});
