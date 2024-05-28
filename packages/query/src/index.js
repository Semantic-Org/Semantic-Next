import { isClient } from '@semantic-ui/utils';
import { Query } from './query.js';

const $ = function (selector, args = {}) {
  if (!args?.root && isClient) {
    args.root = document;
  }
  return new Query(selector, args);
};

const $$ = function (selector, args = {}) {
  args.pierceShadow = true;
  return $(selector, args);
};

// Attach $ and $$ to global scope when running in a browser
if (isClient) {
  const originalDollar = window.$;
  const originalDoubleDollar = window.$$;

  window.$ = $;
  window.$$ = $$;

  // Add a restoreGlobals method to restore the original values of $ and $$
  $.restoreGlobals = function (settings) {
    if (window.$ === $) {
      window.$ = originalDollar;
    }
    if (window.$$ === $$) {
      window.$$ = originalDoubleDollar;
    }
    if (typeof settings == 'object' && settings.removeQuery && window.Query === Query) {
      window.Query = undefined;
    }
    return $;
  };

  window.Query = Query;
}

export { Query, $, $$ };
