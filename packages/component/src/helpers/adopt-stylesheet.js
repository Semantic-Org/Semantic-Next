import { hashCode, isServer } from '@semantic-ui/utils';
import { scopeStyles } from './scope-styles.js';

export const adoptStylesheet = (css, adoptedElement, {
  scopeSelector,
  hash = hashCode(css),
  cacheStylesheet = false,
} = {}) => {
  if (isServer) {
    return;
  }
  if (!adoptedElement) {
    adoptedElement = document;
  }

  if (!adoptedElement.cssHashes) {
    adoptedElement.cssHashes = [];
  }
  // already added
  if (adoptedElement.cssHashes.includes(hash)) {
    return;
  }

  adoptedElement.cssHashes.push(hash);

  let stylesheet;

  if (cacheStylesheet && document.cachedStylesheets[hash]) {
    // reuse stylesheet if cached
    stylesheet = documnet.cachedStylesheets[hash];
  }
  else {
    // otherwise create from scratch
    stylesheet = new CSSStyleSheet();

    // allow selectors to be scoped if passed in
    // i.e .foo => .scope .foo
    if (scopeSelector) {
      css = scopeStyles(css, scopeSelector);
    }
    stylesheet.id = hash;
    stylesheet.replaceSync(css);
  }

  // store stylesheet globally in cache for reuse if specified
  if (cacheStylesheet) {
    if (!document.cachedStylesheets) {
      document.cachedStylesheets = {};
    }
    document.cachedStylesheets[hash] = stylesheet;
  }

  // adopt this stylesheet after others
  adoptedElement.adoptedStyleSheets = [
    ...adoptedElement.adoptedStyleSheets,
    stylesheet,
  ];
};
