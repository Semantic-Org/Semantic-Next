import { isClient } from '@semantic-ui/utils';
import { Query } from './query.js';

const $ = function (selector, args = {}) {
  const isClient = typeof window !== 'undefined';
  if (!args?.root && isClient) {
    args.root = document;
  }
  return new Query(selector, args);
};

const $$ = function (selector, args = {}) {
  args.pierceShadow = true;
  return $(selector, args);
};

function exportGlobals(options = {}) {
  if (isClient) {
    const { $: dollar = true, $$: doubleDollar = true, Query: query = true } = options;

    if (dollar) {
      window.$ = $;
    }

    if (doubleDollar) {
      window.$$ = $$;
    }

    if (query) {
      window.Query = Query;
    }

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
  }
}

export { Query, $, $$, exportGlobals };
