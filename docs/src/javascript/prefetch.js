import { $, $$ } from '@semantic-ui/query';
import { each, idleCallback } from '@semantic-ui/utils';
import { ForesightManager } from 'js.foresight';

const LOGGING_ENABLED = false;

ForesightManager.initialize();

const selector = 'a[href^="/"]';

const register = (els, { logSource = '', log = false } = {}) => {
  if (log) {
    console.log(`[prefetch] registering ${els.length} ${logSource} links`, els);
  }
  each(els, (el) => {
    ForesightManager.instance.register({
      element: el,
      callback: () => {
        if (log) {
          console.log('[prefetch]', el.href);
        }
        fetch(el.href, { priority: 'low' });
      },
    });
  });
};

// Phase 1: light DOM links immediately
const lightLinks = $(selector);
register(lightLinks.get(), { logSource: 'light DOM', log: LOGGING_ENABLED });

// Phase 2: SSR'd shadow DOM links at DOMContentLoaded
let registered = lightLinks;
$(document).ready(() => {
  const ssrLinks = $$(selector).not(registered);
  register(ssrLinks.get(), { logSource: 'shadow DOM (SSR)', log: LOGGING_ENABLED });
  registered = registered.add(ssrLinks);

  // Phase 3: client-rendered shadow DOM links when idle
  idleCallback(() => {
    const clientLinks = $$(selector).not(registered).get();
    register(clientLinks, { logSource: 'shadow DOM (client)', log: LOGGING_ENABLED });
  });
});
