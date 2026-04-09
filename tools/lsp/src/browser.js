import { LanguageService } from './language-service.js';
import { analyzeComponent } from './component-analyzer.js';

/*
  Browser entry point — in-memory file resolver for environments without fs.
  files: Map<string, string> (path → source text)
*/

export function createBrowserResolver(files) {
  return {
    readFile: (p) => {
      const s = files.get(p);
      if (s == null) { throw new Error(`File not found: ${p}`); }
      return s;
    },
    exists: (p) => files.has(p),
    listDir: (dir) => {
      const prefix = dir.endsWith('/') ? dir : dir + '/';
      return [...files.keys()]
        .filter(k => k.startsWith(prefix) && !k.slice(prefix.length).includes('/'))
        .map(k => k.slice(prefix.length));
    },
    resolve: (from, rel) => {
      const dir = from.substring(0, from.lastIndexOf('/'));
      return rel.startsWith('/') ? rel : dir + '/' + rel;
    },
    glob: (pattern, root) => [...files.keys()].filter(k => k.startsWith(root)),
  };
}

export function createService(files) {
  const resolver = createBrowserResolver(files);
  return new LanguageService({
    resolver,
    analyzer: (source, filePath) => analyzeComponent(source, filePath),
  });
}

export { LanguageService } from './language-service.js';
export { analyzeComponent } from './component-analyzer.js';
export { SpecRegistry } from './spec-registry.js';
