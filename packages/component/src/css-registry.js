import { adoptStylesheet, each, isArray, isClient, isPlainObject, isString } from '@semantic-ui/utils';

const registeredCSS = new Map();
const defaultBaseCSS = new Set();

export const RESET_CSS = `@layer global.reset {
  :host {
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  input[type="text"],
  input[type="email"],
  input[type="search"],
  input[type="password"] {
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }
}`;

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

export const getRegisteredCSS = (name) => registeredCSS.get(name);
export const hasRegisteredCSS = (name) => registeredCSS.has(name);

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

registerCSS('reset', RESET_CSS, { default: true });
