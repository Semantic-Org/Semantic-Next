import { hashCode } from './crypto.js';
import { isServer } from './environment.js';
import { each } from './loops.js';
import { isArray, isString } from './types.js';

/*-------------------
      CSS Prefixing
--------------------*/

/*
  Adds vendor prefixes to CSS properties that still require them in modern browsers.
  Only properties that need prefixes within a ~2yr support window are included.
  This list should shrink over time as browsers adopt unprefixed standards.
*/

const prefixRules = [
  // Still prefixed in Safari
  { prop: 'user-select', prefix: '-webkit-' },
  { prop: 'backdrop-filter', prefix: '-webkit-' },
  { prop: 'print-color-adjust', prefix: '-webkit-' },

  // Still prefixed in Firefox
  { prop: 'text-size-adjust', prefix: '-moz-' },
];

const prefixMap = {};
for (const rule of prefixRules) {
  prefixMap[rule.prop] = rule.prefix;
}

const propNames = prefixRules.map(r => r.prop.replace(/-/g, '\\-'));
const propPattern = new RegExp(`^(\\s*)(${propNames.join('|')})\\s*:(.*)$`);
const propQuickTest = new RegExp(`(${propNames.join('|')})\\s*:`);

export const prefixCSS = (css) => {
  if (!css) {
    return css;
  }
  // skip split/join when CSS has no prefixable properties
  if (!propQuickTest.test(css)) {
    return css;
  }
  const lines = css.split('\n');
  const result = [];
  for (const line of lines) {
    const match = line.match(propPattern);
    if (match) {
      const indent = match[1];
      const prop = match[2];
      const value = match[3];
      const prefix = prefixMap[prop];
      if (prefix && !line.trimStart().startsWith('-')) {
        result.push(`${indent}${prefix}${prop}:${value}`);
      }
    }
    result.push(line);
  }
  return result.join('\n');
};

/*-------------------
         CSS
--------------------*/

export const adoptStylesheet = (css, adoptedElement, {
  hash,
  cacheStylesheet = true,
} = {}) => {
  if (isServer) {
    return;
  }
  hash = hash ?? hashCode(css);
  if (!adoptedElement) {
    adoptedElement = document;
  }

  // If adoptedElement doesn't support adoptedStyleSheets, get its root node
  if (!adoptedElement?.adoptedStyleSheets && adoptedElement?.getRootNode) {
    adoptedElement = adoptedElement.getRootNode();
  }

  if (!adoptedElement.cssHashes) {
    adoptedElement.cssHashes = new Set();
  }
  // already added
  if (adoptedElement.cssHashes.has(hash)) {
    return;
  }

  adoptedElement.cssHashes.add(hash);

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
  adoptedElement.adoptedStyleSheets.push(stylesheet);
};

export const extractCSS = (selector, source = document, { returnText = false, exactMatch = false } = {}) => {
  selector = selector.toLowerCase();

  const matchesSelector = (ruleSelector) => {
    if (!ruleSelector) { return false; }
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

  const wrappers = [];
  const extractFromRules = (rules) => {
    each(rules, (rule) => {
      if (matchesSelector(rule.selectorText)) {
        let cssText = rule.cssText;
        for (let i = wrappers.length - 1; i >= 0; i--) {
          cssText = `${wrappers[i]} { ${cssText} }`;
        }
        newStyleSheet.insertRule(cssText, newStyleSheet.cssRules.length);
      }
      if (rule.cssRules?.length) {
        // Only at-rules need wrapping — nested style rules already have resolved selectors
        const isAtRule = !rule.selectorText;
        if (isAtRule) {
          wrappers.push(rule.cssText.substring(0, rule.cssText.indexOf('{')).trim());
        }
        extractFromRules(rule.cssRules);
        if (isAtRule) {
          wrappers.pop();
        }
      }
    });
  };

  each(styleSheets, (sheet) => {
    try {
      extractFromRules(sheet.cssRules);
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
  scopeSelector = scopeSelector.trim();

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
      const lower = selectorText.toLowerCase();
      if (appendToRootElements && (lower === 'html' || lower === 'body')) {
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
      return `@${rule.type === CSSRule.MEDIA_RULE ? 'media' : 'supports'} ${rule.conditionText || ''} { ${
        scopedInnerRules.join(' ')
      } }`;
    }
    else if (rule.type === CSSRule.LAYER_STATEMENT_RULE || (rule.type === 0 && rule.cssRules)) {
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
