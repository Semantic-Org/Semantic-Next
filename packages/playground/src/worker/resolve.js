import { parse } from 'es-module-lexer/js';

/*
  Rewrites bare module specifiers in JS source to CDN URLs.

  Import-map entries stay bare — the browser resolves them natively against the
  map injected into the served HTML, which is what lets mapped packages fetch
  sibling assets (the tailwind wasm case). Only unmapped bare specifiers rewrite.
*/

const isBare = (specifier) => {
  return !/^(\.{0,2}\/|https?:|data:|blob:|node:)/.test(specifier);
};

const parsePackage = (specifier) => {
  const parts = specifier.split('/');
  const name = specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  const subpath = specifier.slice(name.length + 1);
  return { name, subpath };
};

/* Import map prefix semantics: exact key wins, then longest trailing-slash key */
const inImportMap = (specifier, imports = {}) => {
  if (imports[specifier]) {
    return true;
  }
  return Object.keys(imports).some(key => key.endsWith('/') && specifier.startsWith(key));
};

export const toCdnUrl = ({ specifier, cdnBaseUrl, dependencies = {} }) => {
  const { name, subpath } = parsePackage(specifier);
  const version = dependencies[name] || 'latest';
  const versioned = `${name}@${version.replace(/^[\^~]/, '')}`;
  const path = subpath ? `/${subpath}` : '';
  // jsdelivr's ESM build resolves exports maps and transitive deps CDN-side
  if (cdnBaseUrl.includes('jsdelivr')) {
    return `${cdnBaseUrl}/${versioned}${path}/+esm`;
  }
  return `${cdnBaseUrl}/${versioned}${path}`;
};

export const rewriteBareImports = ({ source, importMap, cdnBaseUrl, dependencies }) => {
  let imports;
  try {
    [imports] = parse(source);
  }
  catch {
    // syntax errors reach the browser unmodified, where they produce a real error location
    return source;
  }
  let result = '';
  let last = 0;
  for (const entry of imports) {
    // entries without a static specifier (dynamic import of an expression) can't be rewritten
    if (entry.n === undefined || entry.d === -2) {
      continue;
    }
    if (!isBare(entry.n) || inImportMap(entry.n, importMap?.imports)) {
      continue;
    }
    const url = toCdnUrl({ specifier: entry.n, cdnBaseUrl, dependencies });
    result += source.slice(last, entry.s) + url;
    last = entry.e;
  }
  return result + source.slice(last);
};
