import { adoptStylesheet, each, isArray, isClient, isPlainObject, isString } from '@semantic-ui/utils';
import resetCSS from './css/reset.js';

const registeredCSS = new Map();
const defaultBaseCSS = new Set();

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
    defaultBaseCSS.add(name);
  }
  else if (isDefault === false) {
    defaultBaseCSS.delete(name);
  }
};

export const getCSS = (name) => registeredCSS.get(name);
export const hasCSS = (name) => registeredCSS.has(name);

const adoptEntry = (entry, renderRoot) => {
  if (!entry) {
    return;
  }
  if (isString(entry)) {
    // registered names use the name as the cache key to avoid hashing large framework sheets
    if (registeredCSS.has(entry)) {
      const sheetCSS = registeredCSS.get(entry);
      if (sheetCSS) {
        adoptStylesheet(sheetCSS, renderRoot, { hash: entry });
      }
    }
    else {
      adoptStylesheet(entry, renderRoot);
    }
  }
  else if (isArray(entry)) {
    each(entry, (item) => adoptEntry(item, renderRoot));
  }
  else if (isPlainObject(entry)) {
    // { [id]: css } inline map keys the stylesheet cache by id
    each(entry, (sheetCSS, id) => {
      if (sheetCSS) {
        adoptStylesheet(sheetCSS, renderRoot, { hash: id });
      }
    });
  }
  else if (entry?.cssRules) {
    adoptStylesheet(entry, renderRoot);
  }
};

export const adoptBaseCSS = (baseCSS, renderRoot) => {
  if (baseCSS === false || baseCSS === null) {
    return;
  }
  // allow [false, 'bootstrap'] to opt out of default sheets while adopting explicit entries
  const skipDefaults = isArray(baseCSS) && baseCSS[0] === false;
  if (!skipDefaults) {
    defaultBaseCSS.forEach((name) => {
      const sheetCSS = registeredCSS.get(name);
      if (sheetCSS) {
        adoptStylesheet(sheetCSS, renderRoot, { hash: name });
      }
    });
  }
  if (baseCSS !== undefined) {
    adoptEntry(baseCSS, renderRoot);
  }
};

registerCSS('reset', resetCSS, { default: true });
