import { scopeStyles } from './scope-styles.js';
import { isServer } from '@semantic-ui/utils';

export const adoptStylesheet = (css, { adoptedElement, scopeSelector } = {}) => {
  if(isServer) {
    return;
  }
  if(!adoptedElement) {
    adoptedElement = document;
  }

  const stylesheet = new CSSStyleSheet();
  if(scopeSelector) {
    css = scopeStyles(css, scopeSelector);
  }
  stylesheet.replaceSync(css);

  console.log('adopting', css, adoptedElement);

  // adopt this stylesheet after others
  adoptedElement.adoptedStyleSheets = [
    ...adoptedElement.adoptedStyleSheets,
    stylesheet,
  ];
};
