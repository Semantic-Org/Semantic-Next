/*
  esbuild plugin for Semantic UI.

  Adds the `?raw` import suffix that components use for their templates and
  styles (`import template from './x.html?raw'`). Vite supports ?raw natively,
  esbuild does not, so without this every consumer hand-rolls the same loader.
*/

import { readFile } from 'node:fs/promises';

export function semanticUI() {
  return {
    name: 'semantic-ui',
    setup(build) {
      // import a file's text instead of bundling it as a module.
      build.onResolve({ filter: /\?raw$/ }, async (args) => {
        const result = await build.resolve(args.path.replace(/\?raw$/, ''), {
          kind: args.kind,
          importer: args.importer,
          resolveDir: args.resolveDir,
          namespace: args.namespace,
        });
        if (result.errors.length > 0) {
          return { errors: result.errors };
        }
        return { path: result.path, namespace: 'semantic-ui-raw' };
      });
      build.onLoad({ filter: /.*/, namespace: 'semantic-ui-raw' }, async (args) => ({
        contents: await readFile(args.path, 'utf8'),
        loader: 'text',
        watchFiles: [args.path],
      }));
    },
  };
}

export default semanticUI;
