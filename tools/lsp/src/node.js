import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { globSync } from 'glob';

import { LanguageService } from './language-service.js';
import { analyzeComponent } from './component-analyzer.js';

/*
  Node entry point — wires fs/path/glob into the isomorphic core.
*/

export function createNodeResolver() {
  return {
    readFile: (p) => readFileSync(p, 'utf8'),
    exists: (p) => existsSync(p),
    listDir: (p) => readdirSync(p),
    resolve: (from, rel) => resolve(dirname(from), rel),
    glob: (pattern, root) => globSync(pattern, { cwd: root, absolute: true, ignore: ['**/node_modules/**'] }),
  };
}

export async function createService(projectRoot) {
  const resolver = createNodeResolver();

  // Try to load the compiler for diagnostics
  let compiler = null;
  try {
    const mod = await import('@semantic-ui/templating');
    compiler = mod.TemplateCompiler;
  }
  catch { /* will fall back inside LanguageService */ }

  const service = new LanguageService({
    resolver,
    analyzer: (source, filePath) => analyzeComponent(source, filePath),
    compiler,
    warn: (msg) => console.warn(`[SUI LSP] ${msg}`),
  });
  service.scanSpecs(projectRoot);
  return service;
}

export { LanguageService } from './language-service.js';
export { analyzeComponent } from './component-analyzer.js';
export { SpecRegistry } from './spec-registry.js';
