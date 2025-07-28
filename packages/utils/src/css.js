import { hashCode } from './crypto.js';
import { isServer } from './ssr.js';
import { each } from './looping.js';
import { isString, isArray } from './types.js';
import { inArray } from './arrays.js';

/*-------------------
         CSS
--------------------*/

export const adoptStylesheet = (css, adoptedElement, {
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

  if (cacheStylesheet && document.cachedStylesheets && document.cachedStylesheets[hash]) {
    // reuse stylesheet if cached
    stylesheet = document.cachedStylesheets[hash];
  }
  else {
    // otherwise create from scratch
    stylesheet = new CSSStyleSheet();
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

export const extractCSS = (selector, source = document, { returnText = false, exactMatch = false } = {}) => {
  selector = selector.toLowerCase();

  const matchesSelector = (ruleSelector) => {
    if (!ruleSelector) return false;
    const lowercased = ruleSelector.toLowerCase();
    return exactMatch ? lowercased === selector : lowercased.includes(selector);
  };

  const newStyleSheet = new CSSStyleSheet();

  // Handle different source types
  let styleSheets;
  if (isString(source)) {
    // Raw CSS text - parse and extract
    const tempSheet = new CSSStyleSheet();
    tempSheet.replaceSync(source);
    styleSheets = [tempSheet];
  } 
  else if (source?.cssRules) {
    // Single stylesheet
    styleSheets = [source];
  }
  else if (source?.styleSheets) {
    // Document or element with styleSheets
    styleSheets = source.styleSheets;
  }
  else if (source?.adoptedStyleSheets) {
    // Document with adoptedStyleSheets
    styleSheets = source.adoptedStyleSheets;
  }
  else if (isArray(source)) {
    // Array of stylesheets
    styleSheets = source;
  }
  else {
    // Default to document
    styleSheets = document.styleSheets;
  }

  each(styleSheets, (sheet) => {
    try {
      each(sheet.cssRules, (rule) => {
        if (matchesSelector(rule.selectorText)) {
          newStyleSheet.insertRule(rule.cssText, newStyleSheet.cssRules.length);
        }
        each(rule.cssRules || [], (nestedRule) => {
          if (matchesSelector(nestedRule.selectorText)) {
            newStyleSheet.insertRule(nestedRule.cssText, newStyleSheet.cssRules.length);
          }
        });
      });
    }
    catch (err) {
      console.error('Error accessing stylesheet:', err);
    }
  });

  return returnText 
    ? Array.from(newStyleSheet.cssRules).map(rule => rule.cssText).join('\n')
    : newStyleSheet;
};

export const scopeStyles = (css, scopeSelector = '', { replaceHost = false, appendToRootElements = true } = {}) => {
  scopeSelector = scopeSelector.toLowerCase();

  const scopeRule = (rule, scopeSelector) => {
    if (rule.type === CSSRule.STYLE_RULE) {
      let selectorText = rule.selectorText;
      
      // Handle :host replacement
      if (replaceHost && selectorText.includes(':host')) {
        selectorText = selectorText
          .replace(/:host\(([^)]+)\)/g, `${scopeSelector}$1`) // :host(.class) -> .scope.class
          .replace(/:host/g, scopeSelector); // :host -> .scope
        return `${selectorText} { ${rule.style.cssText} }`;
      }
      
      // Handle html/body - append scope instead of prepend
      if (appendToRootElements && inArray(selectorText.toLowerCase(), ['html', 'body'])) {
        return `${selectorText} ${scopeSelector} { ${rule.style.cssText} }`;
      }
      
      // Default: prepend scope
      return `${scopeSelector} ${selectorText} { ${rule.style.cssText} }`;
    }
    else if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE) {
      let scopedInnerRules = [];
      each(rule.cssRules, (innerRule) => {
        scopedInnerRules.push(scopeRule(innerRule, scopeSelector));
      });
      return `@${rule.type === CSSRule.MEDIA_RULE ? 'media' : 'supports'} ${rule.conditionText || ''} { ${scopedInnerRules.join(' ')} }`;
    }
    else if (rule.type === CSSRule.LAYER_STATEMENT_RULE || rule.type == 0 && rule.cssRules) {
      let scopedInnerRules = [];
      each(rule.cssRules, (innerRule) => {
        scopedInnerRules.push(scopeRule(innerRule, scopeSelector));
      });
      return `@layer ${rule.name} { ${scopedInnerRules.join(' ')} }`;
    }
    else {
      return rule.cssText;
    }
  };

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(css);

  let modifiedRules = [];
  each(styleSheet.cssRules, (rule) => {
    modifiedRules.push(scopeRule(rule, scopeSelector));
  });

  return modifiedRules.join('\n');
};