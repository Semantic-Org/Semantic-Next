/*
  Build-tool plugins for Semantic UI, one implementation for every bundler.

  Adds two import suffixes used when authoring components:
    ?raw  the file's text (templates and styles)
    ?ast  a template compiled to its AST at build time, so the runtime skips
          compilation. Recommended for long-running servers and static builds
          where the compile cost is worth paying once.

  Built on unplugin, so the same loaders run in esbuild, Vite, Rollup,
  Rolldown, webpack, and rspack. The per-bundler integration packages
  (@semantic-ui/esbuild, @semantic-ui/vite, @semantic-ui/rollup) are thin
  wrappers that pick the matching output from here.
*/

import { readFile } from 'node:fs/promises';
import { dirname, resolve as resolvePath } from 'node:path';

import { TemplateCompiler } from '@semantic-ui/compiler';
import { createUnplugin } from 'unplugin';

const RAW_RE = /[?&]raw(?:&|$)/;
const AST_RE = /[?&]ast(?:&|$)/;
const SUI_RE = /[?&](?:raw|ast)(?:&|$)/;

// drop the ?query / #hash so we read the real file off disk
const cleanUrl = (id) => id.replace(/[?#][^]*$/, '');

export const semanticUI = createUnplugin((options, meta) => {
  // Vite resolves ?raw natively, so only contribute ?ast there. Every other
  // bundler needs both.
  const handleRaw = meta?.framework !== 'vite';
  const includeRe = handleRaw ? SUI_RE : AST_RE;

  return {
    name: '@semantic-ui/build',

    // hook filters keep the hooks off every other module. Rollup, Rolldown,
    // webpack, and rspack apply { filter } as a native pre-filter. esbuild
    // filters at its own Go level via the dedicated block below.
    esbuild: {
      onResolveFilter: includeRe,
      onLoadFilter: includeRe,
    },

    resolveId: {
      filter: { id: includeRe },
      handler(id, importer) {
        const wantsRaw = handleRaw && RAW_RE.test(id);
        const wantsAst = AST_RE.test(id);
        if (!wantsRaw && !wantsAst) {
          return;
        }
        const file = cleanUrl(id);
        // esbuild does not expose this.resolve, so map the path ourselves rather
        // than lean on the bundler's resolver. components import co-located files
        // (./component.html?raw), which is exactly this relative case.
        const resolved = importer && file[0] === '.'
          ? resolvePath(dirname(cleanUrl(importer)), file)
          : file;
        return resolved + id.slice(file.length);
      },
    },

    load: {
      filter: { id: includeRe },
      async handler(id) {
        if (handleRaw && RAW_RE.test(id)) {
          const text = await readFile(cleanUrl(id), 'utf8');
          return `export default ${JSON.stringify(text)};`;
        }
        if (AST_RE.test(id)) {
          const template = await readFile(cleanUrl(id), 'utf8');
          const ast = new TemplateCompiler(template).compile();
          return `export default ${JSON.stringify(ast)};`;
        }
      },
    },
  };
});

export default semanticUI;
