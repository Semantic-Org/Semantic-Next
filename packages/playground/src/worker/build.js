import { getContentType, isHTMLFile, isScriptFile, isTypescriptFile } from '../files.js';
import { rewriteBareImports } from './resolve.js';

/*
  Transforms a project's files into servable output. JS files get bare-import
  rewriting only (fast path, no TypeScript load). TS files load the TypeScript
  module lazily — render-only sessions with plain JS never pay its parse cost.
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
  fragments (component.html) and must serve byte-identical.
*/
const isDocument = (html) => /<!doctype|<html|<head|<body/i.test(html);

const injectImportMap = (html, importMap) => {
  if (!importMap || !isDocument(html) || html.includes('type="importmap"')) {
    return html;
  }
  const tag = `<script type="importmap">${JSON.stringify(importMap)}</script>`;
  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const index = headMatch.index + headMatch[0].length;
    return `${html.slice(0, index)}\n${tag}${html.slice(index)}`;
  }
  return `${tag}\n${html}`;
};

export const buildFiles = async ({ files, importMap, cdnBaseUrl }) => {
  const dependencies = readDependencies(files);
  const projectMap = importMap ?? readImportMap(files);
  const diagnostics = {};
  const output = [];

  for (const file of files) {
    if (isScriptFile(file.name)) {
      let source = file.content;
      if (isTypescriptFile(file.name)) {
        const typescript = await loadTypescript();
        const transpiled = typescript.transpile(source, file.name);
        source = transpiled.code;
        if (transpiled.diagnostics?.length) {
          diagnostics[file.name] = transpiled.diagnostics;
        }
      }
      source = rewriteBareImports({ source, importMap: projectMap, cdnBaseUrl, dependencies });
      output.push({
        name: file.name.replace(/\.tsx?$/, '.js'),
        content: source,
        contentType: getContentType('file.js'),
      });
      continue;
    }
    if (isHTMLFile(file.name)) {
      output.push({ ...file, content: injectImportMap(file.content, projectMap) });
      continue;
    }
    // everything else serves verbatim — runtime relative fetches (getText et al) depend on it
    output.push({ ...file });
  }

  return { files: output, diagnostics };
};
