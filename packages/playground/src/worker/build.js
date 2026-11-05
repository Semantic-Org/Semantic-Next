import { getContentType, isHTMLFile, isScriptFile, needsTranspile } from '../files.js';
import { previewBridge } from '../preview/bridge.js';
import { rewriteBareImports } from './resolve.js';

/*
  Transforms a project's files into servable output. JS files get bare-import
  rewriting only (fast path, no TypeScript load). TS and JSX files load the
  TypeScript module lazily — render-only sessions with plain JS never pay its
  parse cost. JSX compiles to the automatic runtime, so React and Preact apps
  need no compiler of their own: the runtime import resolves like any other
  bare specifier.
*/

let typescriptModule;
const loadTypescript = async () => {
  if (!typescriptModule) {
    typescriptModule = import('./typescript-service.js').then(module => module.default ?? module);
  }
  return typescriptModule;
};

const readDependencies = (files) => {
  const packageFile = files.find(file => file.name === 'package.json');
  if (!packageFile) {
    return {};
  }
  try {
    return JSON.parse(packageFile.content).dependencies ?? {};
  }
  catch {
    return {};
  }
};

const readImportMap = (files) => {
  const mapFile = files.find(file => file.contentType?.includes('importmap'));
  if (!mapFile) {
    return undefined;
  }
  try {
    return JSON.parse(mapFile.content);
  }
  catch {
    return undefined;
  }
};

/*
  The import map must reach every served document for bare specifiers to resolve
  natively. Documents only — html files without document structure are template
  fragments (component.html) and must serve byte-identical. Word boundaries
  matter: a fragment containing <header> is not a document.
*/
const isDocument = (html) => /<!doctype|<html[\s>]|<head[\s>]|<body[\s>]/i.test(html);

const insertInHead = (html, content) => {
  const headMatch = html.match(/<head(\s[^>]*)?>/i);
  if (headMatch) {
    const index = headMatch.index + headMatch[0].length;
    return `${html.slice(0, index)}\n${content}${html.slice(index)}`;
  }
  return `${content}\n${html}`;
};

const injectImportMap = (html, importMap) => {
  if (!importMap || !isDocument(html) || html.includes('type="importmap"')) {
    return html;
  }
  return insertInHead(html, `<script type="importmap">${JSON.stringify(importMap)}</script>`);
};

/*
  Same contract as the import map: served documents only, fragments stay
  byte-identical. Reaches documents that author their own <html> — where
  host-level file injections never apply — without touching editor source.
*/
const injectHeadHTML = (html, headHTML) => {
  if (!headHTML || !isDocument(html)) {
    return html;
  }
  return insertInHead(html, headHTML);
};

/* first in <head>, so the preview channel is open before any app script runs */
const injectBridge = (html, sessionId) => {
  if (!sessionId || !isDocument(html)) {
    return html;
  }
  return insertInHead(html, previewBridge(sessionId));
};

export const buildFiles = async ({ files, importMap, cdnBaseUrl, headHTML, sessionId, jsxImportSource }) => {
  const dependencies = readDependencies(files);
  const projectMap = importMap ?? readImportMap(files);
  const diagnostics = {};
  const output = [];

  for (const file of files) {
    if (isScriptFile(file.name)) {
      let source = file.content;
      if (needsTranspile(file.name)) {
        const typescript = await loadTypescript();
        const transpiled = typescript.transpile(source, file.name, { jsxImportSource });
        source = transpiled.code;
        if (transpiled.diagnostics?.length) {
          diagnostics[file.name] = transpiled.diagnostics;
        }
      }
      source = rewriteBareImports({ source, importMap: projectMap, cdnBaseUrl, dependencies });
      const name = file.name.replace(/\.(tsx?|jsx)$/, '.js');
      output.push({ name, content: source, contentType: getContentType(name) });
      continue;
    }
    if (isHTMLFile(file.name)) {
      let html = injectImportMap(file.content, projectMap);
      html = injectHeadHTML(html, headHTML);
      html = injectBridge(html, sessionId);
      output.push({ ...file, content: html });
      continue;
    }
    // everything else serves verbatim — runtime relative fetches (getText et al) depend on it
    output.push({ ...file });
  }

  return { files: output, diagnostics };
};
