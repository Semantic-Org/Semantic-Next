import { scopeStyles } from './scope-styles.js';
import { isServer, hashCode } from '@semantic-ui/utils';

export const adoptStylesheet = (css, { adoptedElement, scopeSelector } = {}) => {
  if(isServer) {
    return;
  }
  if(!adoptedElement) {
    adoptedElement = document;
  }

  const hash = hashCode(css);
  if(!adoptedElement.cssHashes) {
    adoptedElement.cssHashes = [];
  }
  if(adoptedElement.cssHashes.includes(hash)) {
    // already added
    return;
  }

  adoptedElement.cssHashes.push(hash);

  const stylesheet = new CSSStyleSheet();

  // allow selectors to be scoped if passed in
  // i.e .foo => .scope .foo
  if(scopeSelector) {
    css = scopeStyles(css, scopeSelector);
  }
  stylesheet.replaceSync(css);

  // adopt this stylesheet after others
  adoptedElement.adoptedStyleSheets = [
    ...adoptedElement.adoptedStyleSheets,
    stylesheet,
  ];
};
