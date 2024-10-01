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

let originalDollar;
let originalDoubleDollar;

const exportGlobals = function({ dollar = true, doubleDollar = true, query = true} = {}) {
  if (isClient) {

    if(dollar) {
      originalDollar = window.$;
      window.$ = $;
    }

    if (doubleDollar) {
      originalDoubleDollar = window.$$;
      window.$$ = $$;
    }

    if (query) {
      window.Query = Query;
    }
  }
};

// Add a restoreGlobals method to restore the original values of $ and $$
const restoreGlobals = function(settings) {
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

// Bind Query to a different alias than $
const useAlias = function() {
  return new Query(...arguments);
};

export { Query, $, $$, exportGlobals, restoreGlobals, useAlias };
