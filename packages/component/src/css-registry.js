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
  if (isClient && document.cachedStylesheets?.[name]) {
    delete document.cachedStylesheets[name];
  }
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
