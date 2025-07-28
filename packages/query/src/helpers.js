import { isClient } from '@semantic-ui/utils';
import { Query } from './query.js';

const $ = function(selector, args = {}) {
  const isClient = typeof document !== 'undefined';
  if (!args?.root && isClient) {
    args.root = document;
  }
  return new Query(selector, args);
};

const $$ = function(selector, args = {}) {
  args.pierceShadow = true;
  return $(selector, args);
};

let originalDollar;
let originalDoubleDollar;

// Exports globals into window or global scope.
const exportGlobals = function({ dollar = true, doubleDollar = true, query = true } = {}) {
  if (globalThis) {
    if (dollar) {
      originalDollar = globalThis.$;
      globalThis.$ = $;
    }

    if (doubleDollar) {
      originalDoubleDollar = globalThis.$$;
      globalThis.$$ = $$;
    }

    if (query) {
      globalThis.Query = Query;
    }
  }
};

// Add a restoreGlobals method to restore the original values of $ and $$
const restoreGlobals = function(settings) {
  if (globalThis.$ === $) {
    globalThis.$ = originalDollar;
  }
  if (globalThis.$$ === $$) {
    globalThis.$$ = originalDoubleDollar;
  }
  if (typeof settings == 'object' && settings.removeQuery && globalThis.Query === Query) {
    globalThis.Query = undefined;
  }
  return $;
};

// Bind Query to a different alias than $
export const useAlias = () => $;

// Expose prototype for plugins
$$.fn =
  $.fn =
  $$.plugin =
  $.plugin =
    Query.prototype;

export { $, $$, exportGlobals, restoreGlobals };
