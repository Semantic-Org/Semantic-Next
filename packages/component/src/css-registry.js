import { adoptStylesheet, each, isArray, isClient, isPlainObject, isString } from '@semantic-ui/utils';
import resetCSS from './css/reset.js';

const registeredCSS = new Map();
const defaultCSS = new Set();

export const registerCSS = (name, css, { default: isDefault } = {}) => {
  if (isPlainObject(name)) {
    const options = css || {};
    each(name, (sheetCSS, sheetName) => {
      registerCSS(sheetName, sheetCSS, options);
    });
    return;
  }
  registeredCSS.set(name, css);
  // drop any cached CSSStyleSheet so overwriting a preset like 'reset' takes effect on next mount
  if (isClient && document.cachedStylesheets?.[name]) {
    delete document.cachedStylesheets[name];
  }
  // only mutate default membership when explicitly passed so overwriting 'reset' keeps it default
  if (isDefault === true) {
    defaultCSS.add(name);
  }
  else if (isDefault === false) {
    defaultCSS.delete(name);
  }
};

export const getCSS = (name) => registeredCSS.get(name);
export const hasCSS = (name) => registeredCSS.has(name);

const adoptCSS = (css, renderRoot) => {
  if (!css) {
    return;
  }
  if (isString(css)) {
    // registered names use the name as the cache key to avoid hashing large framework sheets
    if (registeredCSS.has(css)) {
      const sheetCSS = registeredCSS.get(css);
      if (sheetCSS) {
        adoptStylesheet(sheetCSS, renderRoot, { hash: css });
      }
    }
    else {
      adoptStylesheet(css, renderRoot);
    }
  }
  else if (isArray(css)) {
    each(css, (item) => adoptCSS(item, renderRoot));
  }
  else if (isPlainObject(css)) {
    // { [id]: css } inline map keys the stylesheet cache by id
    each(css, (sheetCSS, id) => {
      if (sheetCSS) {
        adoptStylesheet(sheetCSS, renderRoot, { hash: id });
      }
    });
  }
  else if (css?.cssRules) {
    adoptStylesheet(css, renderRoot);
  }
};

export const adoptBaseCSS = (baseCSS, renderRoot) => {
  if (baseCSS === false || baseCSS === null) {
    return;
  }
  // allow [false, 'bootstrap'] to opt out of default sheets while adopting explicit entries
  const skipDefaults = isArray(baseCSS) && baseCSS[0] === false;
  if (!skipDefaults) {
    defaultCSS.forEach((name) => adoptCSS(name, renderRoot));
  }
  if (baseCSS !== undefined) {
    adoptCSS(baseCSS, renderRoot);
  }
};

registerCSS('reset', resetCSS, { default: true });
